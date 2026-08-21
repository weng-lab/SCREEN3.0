import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

/**
 * Server-side proxy for Ensembl variant lookups.
 *
 * Exists so that variant data is fetched once per rsID set per day for the whole site rather than
 * once per browser per component mount. Ensembl rate limits by client, and the previous approach
 * (one GET per rsID, fanned out from every user's browser) risked 429s that degraded silently.
 *
 * Population frequencies are opt-in: they are ~14x the payload of the allele-only response and
 * only one consumer reads them. See the `pops` param in the Ensembl POST variation docs.
 */

const ENSEMBL_POST_VARIATION = "https://rest.ensembl.org/variation/homo_sapiens";

/** Ensembl's documented "Maximum POST size" for this endpoint */
const ENSEMBL_MAX_POST_SIZE = 200;

/**
 * Chunk sizes are payload-driven, not failure-driven: unknown rsIDs are omitted from the response
 * rather than erroring, so a large chunk is not a large blast radius. Measured ~0.9KB per variant
 * without frequencies and ~12.7KB with, hence the much smaller batch when frequencies are included.
 */
const CHUNK_SIZE_ALLELES = ENSEMBL_MAX_POST_SIZE;
const CHUNK_SIZE_FREQUENCIES = 25;

/** Guards the route against being used to drive arbitrary volumes of upstream traffic */
const MAX_RSIDS_PER_REQUEST = 1000;

const REVALIDATE_SECONDS = 60 * 60 * 24;

/** The only populations rendered by the app, out of the ~150 Ensembl returns per variant */
const POPULATION_PREFIX = "1000GENOMES:phase_3:";
const POPULATIONS = ["AMR", "EUR", "AFR", "SAS", "EAS"].map((p) => POPULATION_PREFIX + p);

export interface Frequency {
  population: string;
  frequency: number;
}

export interface SnpAlleles {
  ref: string;
  alt: string;
  frequencies?: Frequency[];
}

export type SnpAllelesResponse = { [rsid: string]: SnpAlleles | null };

type EnsemblMapping = {
  allele_string?: string;
  coord_system?: string;
  assembly_name?: string;
};

type EnsemblPopulation = {
  population?: string;
  allele?: string;
  frequency?: number;
};

type EnsemblVariation = {
  mappings?: EnsemblMapping[];
  populations?: EnsemblPopulation[];
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

/**
 * Picks the primary genomic mapping. A variant can also map to patch scaffolds (rs56116432 returns
 * both chr9 and HG2030_PATCH), and those carry allele strings too, so indexing [0] would rely on
 * Ensembl's array ordering to avoid reading alleles off a patch.
 */
const primaryMapping = (variation: EnsemblVariation) =>
  variation.mappings?.find((m) => m.coord_system === "chromosome") ?? variation.mappings?.[0];

const parseVariation = (variation: EnsemblVariation, includeFrequencies: boolean): SnpAlleles | null => {
  const alleleString = primaryMapping(variation)?.allele_string;
  if (!alleleString) return null;

  const alleles = alleleString.split("/");
  const ref = alleles[0];
  const alt = alleles.slice(1).join(",");

  if (!includeFrequencies) return { ref, alt };

  const frequencies = (variation.populations ?? []).flatMap((p) =>
    POPULATIONS.includes(p.population) && p.allele === ref
      ? [{ population: p.population.replace(POPULATION_PREFIX, ""), frequency: p.frequency }]
      : []
  );

  return { ref, alt, frequencies };
};

/**
 * Cached per (chunk, includeFrequencies). unstable_cache keys on the serialized arguments, so
 * callers must pass a sorted, deduplicated chunk for keys to be reusable. Only the parsed result is
 * cached, which keeps entries small - the raw Ensembl response is discarded here.
 */
const fetchChunk = unstable_cache(
  async (rsids: string[], includeFrequencies: boolean): Promise<SnpAllelesResponse> => {
    const url = includeFrequencies ? `${ENSEMBL_POST_VARIATION}?pops=1` : ENSEMBL_POST_VARIATION;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ids: rsids }),
    });

    if (!response.ok) {
      throw new Error(`Ensembl responded ${response.status}`);
    }

    const data: Record<string, EnsemblVariation> = await response.json();

    // Ensembl omits unrecognized rsIDs from the response rather than erroring, so absent means
    // "no such variant" and is reported to the client as null.
    return Object.fromEntries(
      rsids.map((rsid) => [rsid, data[rsid] ? parseVariation(data[rsid], includeFrequencies) : null])
    );
  },
  ["ensembl-variation"],
  { revalidate: REVALIDATE_SECONDS }
);

export async function POST(request: NextRequest) {
  let body: { rsids?: unknown; includeFrequencies?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { rsids, includeFrequencies } = body;

  if (!Array.isArray(rsids) || rsids.some((rsid) => typeof rsid !== "string" || !rsid)) {
    return NextResponse.json({ error: "`rsids` must be an array of non-empty strings" }, { status: 400 });
  }

  if (rsids.length > MAX_RSIDS_PER_REQUEST) {
    return NextResponse.json({ error: `At most ${MAX_RSIDS_PER_REQUEST} rsids per request` }, { status: 400 });
  }

  const withFrequencies = includeFrequencies === true;

  // Sorted and deduplicated so that equivalent requests produce identical cache keys
  const uniqueRsids = [...new Set(rsids as string[])].sort();

  if (uniqueRsids.length === 0) {
    return NextResponse.json({} satisfies SnpAllelesResponse);
  }

  const chunks = chunk(uniqueRsids, withFrequencies ? CHUNK_SIZE_FREQUENCIES : CHUNK_SIZE_ALLELES);

  try {
    const results = await Promise.all(chunks.map((c) => fetchChunk(c, withFrequencies)));
    return NextResponse.json(Object.assign({}, ...results) as SnpAllelesResponse);
  } catch (error) {
    console.error("Error fetching Ensembl variation data:", error);
    return NextResponse.json({ error: "Failed to fetch variant data from Ensembl" }, { status: 502 });
  }
}
