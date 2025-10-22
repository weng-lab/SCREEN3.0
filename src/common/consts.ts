export const CCRE_CLASSES = ["PLS", "pELS", "dELS", "CA-H3K4me3", "CA-CTCF", "CA-TF", "CA", "TF", "InActive", "noclass"] as const;

export const ccreClassDescriptions: Record<string, string> = {
  PLS: "Promoter",
  pELS: "Proximal Enhancer",
  dELS: "Distal Enhancer",
  "CA-H3K4me3": "CA-H3K4me3",
  "CA-CTCF": "CA-CTCF",
  "CA-TF": "CA-TF",
  CA: "CA",
  TF: "TF",
};