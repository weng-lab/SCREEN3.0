import { CcreClass } from "./types/globalTypes";

export const CCRE_CLASSES = [
  "PLS",
  "pELS",
  "dELS",
  "CA-H3K4me3",
  "CA-CTCF",
  "CA-TF",
  "CA",
  "TF",
  "InActive",
  "noclass",
] as const;

export const CLASS_DESCRIPTIONS: Record<CcreClass, string> = {
  PLS: "Promoter",
  pELS: "Proximal Enhancer",
  dELS: "Distal Enhancer",
  "CA-H3K4me3": "CA-H3K4me3",
  "CA-CTCF": "CA-CTCF",
  "CA-TF": "CA-TF",
  CA: "CA",
  TF: "TF",
  noclass: "Unclassified",
  InActive: "Low CA",
};

export const CCRE_ASSAYS = ["dnase", "atac", "h3k4me3", "h3k27ac", "ctcf"] as const;
