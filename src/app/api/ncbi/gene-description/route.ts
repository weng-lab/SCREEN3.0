import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

/**
 * Server-side proxy for NCBI gene descriptions, via the NLM Clinical Table Search Service.
 *
 * Exists so a description is fetched once per gene per day for the whole site rather than once per
 * browser per mount, and so the lookup is an exact symbol match rather than a substring search.
 */

const NCBI_GENES_SEARCH = "https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search";

/**
 * `q=Symbol:<name>` constrains the match to the Symbol field exactly, rather than the substring
 * search `terms` performs on its own. That matters: `terms=TP53` reports 72 matches and returns a
 * default page of 7 (TP53TG5, TP53RK, ...) that does not include TP53 itself, so a substring search
 * plus a client-side exact filter silently finds nothing for common genes.
 *
 * `terms` is still required by the API - `q` alone is a 400.
 */
const buildSearchUrl = (name: string) => {
  const url = new URL(NCBI_GENES_SEARCH);
  url.searchParams.set("terms", name);
  url.searchParams.set("q", `Symbol:${name}`);
  // Pins the response columns to [symbol, description] instead of relying on the default layout
  url.searchParams.set("df", "Symbol,description");
  url.searchParams.set("maxList", "5");
  return url;
};

/** Guards the route against being used to drive arbitrary upstream traffic */
const MAX_NAME_LENGTH = 100;

const REVALIDATE_SECONDS = 60 * 60 * 24;

export interface GeneDescriptionResponse {
  description: string | null;
}

/**
 * Cached per gene symbol. unstable_cache keys on the serialized arguments, so callers must pass an
 * already-normalized name for keys to be reusable. The API is case-insensitive on both `terms` and
 * `q`, so upper-casing only affects the cache key, not the result.
 */
const fetchGeneDescription = unstable_cache(
  async (name: string): Promise<string | null> => {
    const response = await fetch(buildSearchUrl(name), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`NLM responded ${response.status}`);
    }

    // Response is a positional array; index 3 holds the display rows selected by `df`
    const data = await response.json();
    const rows: [string, string][] = data?.[3] ?? [];

    // Defensive: `q=Symbol:` is already exact, but never attribute another gene's description
    const match = rows.find(([symbol]) => symbol?.toUpperCase() === name);
    return match?.[1] ?? null;
  },
  ["ncbi-gene-description"],
  { revalidate: REVALIDATE_SECONDS }
);

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json({ error: "`name` query parameter is required" }, { status: 400 });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: `\`name\` must be at most ${MAX_NAME_LENGTH} characters` }, { status: 400 });
  }

  try {
    const description = await fetchGeneDescription(name.toUpperCase());
    return NextResponse.json({ description } satisfies GeneDescriptionResponse, {
      // Lets a repeat visit to the same gene skip the round trip entirely
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    console.error("Error fetching gene description from NLM:", error);
    return NextResponse.json({ error: "Failed to fetch gene description" }, { status: 502 });
  }
}
