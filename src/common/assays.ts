import type { CcreAssay } from "common/types/globalTypes";

export const CCRE_ASSAYS = ["dnase", "atac", "h3k4me3", "h3k27ac", "ctcf"] as const;

export const ASSAY_COLORS: Record<string, string> = {
  dnase: "#06da93",
  h3k4me3: "#ff0000",
  h3k27ac: "#ffcd00",
  ctcf: "#00b0d0",
  atac: "#02c7b9",
  "rna-seq": "#00aa00",
  chromhmm: "#00ff00",
  ccre: "#0c184a",
  wgbs: "#648bd8",
};

/**
 *
 * @param assay
 * @returns Formatted assay name
 */
export const formatAssay = (assay: CcreAssay) => {
  switch (assay) {
    case "atac":
      return "ATAC";
    case "ctcf":
      return "CTCF";
    case "dnase":
      return "DNase";
    case "h3k27ac":
      return "H3K27ac";
    case "h3k4me3":
      return "H3K4me3";
  }
};
