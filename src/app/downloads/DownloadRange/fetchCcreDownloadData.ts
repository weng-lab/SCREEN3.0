import { ApolloClient } from "@apollo/client";
import { gql } from "common/types/generated";
import type { Assembly, CcreAssay, CcreClass, GenomicRange } from "common/types/globalTypes";
import { classifyCcre } from "common/utility";
import { parseZScoresArray, ZScoresEntry } from "common/utils/parseCcreZScores";

/**
 * Cell-agnostic skeleton for every cCRE intersecting the requested region: coordinates,
 * classification, max z-scores (across biosamples), conservation, and the nearest TSS
 * (mid-cCRE anchor). Covers the entire no-biosample download in a single request.
 */
const CCRE_DOWNLOAD_MAX_Z = gql(`
  query ccreDownloadMaxZScores(
    $assembly: String!
    $coordinates: [GenomicRangeInput]
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      coordinates: $coordinates
      nearbygeneslimit: 1
    ) {
      accession
      chromosome
      start
      stop
      ccre_group
      dnase_max_zscore
      atac_max_zscore
      h3k4me3_max_zscore
      h3k27ac_max_zscore
      ctcf_max_zscore
      mammals
      primates
      vertebrates
      midccre_nearestgenes {
        gene
        distance
      }
    }
  }
`);

/**
 * Biosample-specific z-scores for the same region, keyed by accession. Only fetched when a
 * biosample is selected, then overlaid onto the skeleton's z-score columns. This type carries
 * NO conservation/classification fields, so the skeleton query still runs alongside it.
 */
const CCRE_DOWNLOAD_BIOSAMPLE_Z = gql(`
  query ccreDownloadBiosampleZScores(
    $assembly: String!
    $coordinates: [GenomicRangeInput]
    $biosample: [String]
  ) {
    getcCREZScoresQuery(
      assembly: $assembly
      coordinates: $coordinates
      biosample_value: $biosample
      include_biosample_details: false
    ) {
      accession
      zscores
    }
  }
`);

export type CcreDownloadRow = {
  accession: string;
  chromosome: string;
  start: number;
  end: number;
  /** Cell-agnostic backend group, or the biosample-specific classification when a biosample is selected */
  group: CcreClass;
  dnase: number | null;
  atac: number | null;
  h3k4me3: number | null;
  h3k27ac: number | null;
  ctcf: number | null;
  /** Conservation is GRCh38-only; null on mm10 (the API does not return it there) */
  primates: number | null;
  mammals: number | null;
  vertebrates: number | null;
  /** Nearest TSS, measured from the middle of the cCRE body */
  nearestGene: string | null;
  nearestGeneDistance: number | null;
};

export type FetchCcreDownloadDataParams = {
  assembly: Assembly;
  coordinates: GenomicRange[];
  /** Biosample `name`; when provided, z-scores and classification become biosample-specific */
  biosample?: string;
  /**
   * When provided, only rows whose returned `group` is in this set are kept. The filter targets the
   * classification actually returned — global `group` with no biosample, biosample-specific
   * `classifyCcre` result with one — so it stays aligned with what the download shows.
   */
  classes?: CcreClass[];
};

export async function fetchCcreDownloadData(
  client: ApolloClient,
  { assembly, coordinates, biosample, classes }: FetchCcreDownloadDataParams
): Promise<CcreDownloadRow[]> {
  const skeletonPromise = client.query({
    query: CCRE_DOWNLOAD_MAX_Z,
    variables: { assembly, coordinates },
    fetchPolicy: "no-cache",
  });

  const biosamplePromise = biosample
    ? client.query({
        query: CCRE_DOWNLOAD_BIOSAMPLE_Z,
        variables: { assembly, coordinates, biosample: [biosample] },
        fetchPolicy: "no-cache",
      })
    : null;

  const [skeletonResult, biosampleResult] = await Promise.all([skeletonPromise, biosamplePromise]);

  // accession -> biosample-specific z-scores (only when a biosample is selected). Every cCRE in
  // the region is returned for a valid biosample (no-signal assays come back as a low score, not
  // omitted), so only assays not performed for the biosample stay absent and resolve to null below.
  const biosampleScores = biosampleResult
    ? new Map(
        (biosampleResult.data.getcCREZScoresQuery ?? []).map((entry) => [
          entry.accession,
          parseZScoresArray(entry.zscores as ZScoresEntry<null>[]),
        ])
      )
    : null;

  const rows = (skeletonResult.data.getmaxZScoresQuery ?? []).map((ccre): CcreDownloadRow => {
    const overlay = biosampleScores?.get(ccre.accession);
    const assayScore = (assay: CcreAssay, maxZscore: number | null | undefined): number | null => {
      if (!biosample) return maxZscore ?? null;
      // Biosample scores arrive at full float precision; round to 3 decimals to match the
      // already-truncated max z-scores so both download variants are formatted consistently.
      const score = overlay?.[assay];
      return score != null ? Number(score.toFixed(3)) : null;
    };

    const nearest = ccre.midccre_nearestgenes?.[0];

    // With a biosample selected, reclassify from its z-scores (same logic as useCcreZScores). The
    // nearest-TSS distance is location-based, so the skeleton's value is reused rather than refetched.
    // Without a biosample, keep the cell-agnostic group from the backend.
    const group: CcreClass = biosample
      ? classifyCcre(overlay ?? {}, overlay?.tf ?? false, nearest?.distance ?? Infinity)
      : (ccre.ccre_group as CcreClass);

    return {
      accession: ccre.accession,
      chromosome: ccre.chromosome!,
      start: ccre.start!,
      end: ccre.stop!,
      group,
      dnase: assayScore("dnase", ccre.dnase_max_zscore),
      atac: assayScore("atac", ccre.atac_max_zscore),
      h3k4me3: assayScore("h3k4me3", ccre.h3k4me3_max_zscore),
      h3k27ac: assayScore("h3k27ac", ccre.h3k27ac_max_zscore),
      ctcf: assayScore("ctcf", ccre.ctcf_max_zscore),
      primates: ccre.primates ?? null,
      mammals: ccre.mammals ?? null,
      vertebrates: ccre.vertebrates ?? null,
      nearestGene: nearest?.gene ?? null,
      nearestGeneDistance: nearest?.distance ?? null,
    };
  });

  return classes ? rows.filter((row) => classes.includes(row.group)) : rows;
}
