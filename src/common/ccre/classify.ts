import type { CcreClass } from "common/types/globalTypes";

/**
 *
 * @param scores Any missing are treated as -11 in logic
 * @param distanceToTSS If the cCRE overlaps a TSS, this needs to be 0 to handle edge case of large promoter (400bp+) being centered >200bp away
 * @returns
 */
export function classifyCcre(
  scores: { dnase?: number; atac?: number; h3k4me3?: number; h3k27ac?: number; ctcf?: number },
  bindsTF: boolean,
  distanceToTSS: number
): CcreClass {
  const dnase = scores.dnase ?? -11.0;
  const h3k4me3 = scores.h3k4me3 ?? -11.0;
  const h3k27ac = scores.h3k27ac ?? -11.0;
  const ctcf = scores.ctcf ?? -11.0;

  let ccreClass: CcreClass;
  if (dnase != -11.0) {
    if (dnase > 1.64) {
      if (h3k4me3 > 1.64) {
        if (distanceToTSS <= 200) {
          ccreClass = "PLS"; //Promoter-like signatures (promoter) must fall within 200 bp of a TSS and have high chromatin accessibility and H3K4me3 signals.
        } else if (h3k27ac <= 1.64 && distanceToTSS > 200) {
          ccreClass = "CA-H3K4me3"; //Chromatin accessibility + H3K4me3 (CA-H3K4me3) have high chromatin accessibility and H3K4me3 signals but low H3K27ac signals and do not fall within 200 bp of a TSS.
        } else if (distanceToTSS <= 2000 && h3k27ac > 1.64) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000 && h3k27ac > 1.64) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (h3k27ac > 1.64) {
        if (distanceToTSS <= 2000) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (ctcf > 1.64) {
        ccreClass = "CA-CTCF"; //Chromatin accessibility + CTCF (CA-CTCF) have high chromatin accessibility and CTCF signals but low H3K4me3 and H3K27ac signals.
      } else if (bindsTF) {
        ccreClass = "CA-TF"; //Chromatin accessibility + transcription factor (CA-TF) have high chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "CA"; //Chromatin accessibility (CA) have high chromatin accessibility, and low H3K4me3, H3K27ac, and CTCF signals.
      }
    } else {
      if (bindsTF) {
        ccreClass = "TF"; //Transcription factor (TF) have low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "InActive"; //low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are NOT bound by a transcription factor.
      }
    }
  } else {
    ccreClass = "noclass"; //If not active in DNase, No class assigned
  }
  return ccreClass;
}

/**
 * The set of biosample-specific classes a cCRE can be assigned given which assays are available,
 * derived directly from {@link classifyCcre}'s logic. Missing assays are treated as -11, which
 * eliminates the classes that depend on them. Notably DNase gates everything (no DNase -> the only
 * possible class is `noclass`), and ATAC never participates in classification. Keep in sync with
 * `classifyCcre` if its rules change.
 *
 * Only meaningful for the biosample-specific case; the global classification can be any class.
 */
export function reachableCcreClasses(assays: {
  dnase: boolean;
  h3k4me3: boolean;
  h3k27ac: boolean;
  ctcf: boolean;
}): CcreClass[] {
  if (!assays.dnase) return ["noclass"];
  // Reachable with DNase alone (CA-TF/TF only need the tf flag, which rides along in the data)
  const classes: CcreClass[] = ["CA", "CA-TF", "TF", "InActive"];
  if (assays.h3k4me3) classes.push("PLS", "CA-H3K4me3");
  if (assays.h3k27ac) classes.push("pELS", "dELS");
  if (assays.ctcf) classes.push("CA-CTCF");
  return classes;
}
