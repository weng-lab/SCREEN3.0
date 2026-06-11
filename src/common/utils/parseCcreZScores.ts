import type { CcreZScores } from "common/types/globalTypes";

/**
 * One experiment row inside the `zscores` JSON array returned by `getcCREZScoresQuery`.
 * The tuple is positional; the indices are documented below. `Details` is `string` when the
 * query was run with `include_biosample_details: true`, otherwise `null`.
 */
export type ZScoresEntry<Details extends string | null = string | null> = [
  string,              // 0 experiment_accession
  string,              // 1 file_accession
  string,              // 2 assay
  string,              // 3 biosample name (internal, used as the grouping key)
  Details,             // 4 biosample displayname
  Details,             // 5 ontology
  Details,             // 6 sample_type
  Details,             // 7 lifestage
  number,              // 8 score
  "yes" | "no" | "na", // 9 tf
];

/**
 * Collapses the positional `zscores` tuples for a single cCRE into a keyed {@link CcreZScores}
 * object plus a `tf` flag (whether the cCRE is bound by a transcription factor). Shared by
 * {@link useCcreZScores} and the DownloadRange fetcher so the tuple layout is decoded in exactly
 * one place. Assumes a non-empty array (the API omits cCREs with no biosample data).
 */
export const parseZScoresArray = (zScoresArray: ZScoresEntry<null>[]): CcreZScores & { tf: boolean } => {
  const zScoresAndTf: CcreZScores & { tf: boolean } = { tf: zScoresArray[0][9] === "yes" };
  zScoresArray.forEach((experiment) => {
    const assay = experiment[2];
    const score = experiment[8];
    switch (assay) {
      case "DNase":
        zScoresAndTf.dnase = score;
        break;
      case "H3K4me3":
        zScoresAndTf.h3k4me3 = score;
        break;
      case "H3K27ac":
        zScoresAndTf.h3k27ac = score;
        break;
      case "CTCF":
        zScoresAndTf.ctcf = score;
        break;
      case "ATAC":
        zScoresAndTf.atac = score;
        break;
    }
  });
  return zScoresAndTf;
};
