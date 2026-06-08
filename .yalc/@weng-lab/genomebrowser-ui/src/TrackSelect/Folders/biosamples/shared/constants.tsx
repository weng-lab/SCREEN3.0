import { Box } from "@mui/material";
import type { Assembly } from "../../types";

export type { Assembly };

export const assayTypes = [
  "cCRE",
  "DNase",
  "H3K4me3",
  "H3K27ac",
  "ATAC",
  "CTCF",
  "RNA-seq",
  "ChromHMM",
  "WGBS",
];

export const lifeStages = ["Adult", "Embryonic", "N/A"];

export const ontologyTypes = [
  "Aggregate",
  "Adipose",
  "Adrenal gland",
  "Blood",
  "Blood vessel",
  "Bone",
  "Bone marrow",
  "Brain",
  "Breast",
  "Connective tissue",
  "Embryo",
  "Epithelium",
  "Esophagus",
  "Eye",
  "Fallopian Tube",
  "Gallbladder",
  "Heart",
  "Kidney",
  "Large Intestine",
  "Limb",
  "Liver",
  "Lung",
  "Lymphoid Tissue",
  "Muscle",
  "Mouth",
  "Nerve",
  "Nose",
  "Pancreas",
  "Parathyroid Gland",
  "Ovary",
  "Penis",
  "Placenta",
  "Prostate",
  "Skin",
  "Small Intestine",
  "Spinal Cord",
  "Spleen",
  "Stomach",
  "Testis",
  "Thymus",
  "Thyroid",
  "Urinary Bladder",
  "Uterus",
  "Vagina",
];

/** Color mapping for assay types */
export const assayColorMap: { [key: string]: string } = {
  DNase: "#06da93",
  ATAC: "#02c7b9",
  H3K4me3: "#ff2020",
  ChromHMM: "#0097a7",
  H3K27ac: "#fdc401",
  CTCF: "#01a6f1",
  cCRE: "#000000",
  "RNA-seq": "#00aa00",
  WGBS: "#648bd8",
};

/**
 * Creates the assay icon for DataGrid and RichTreeView
 * @param type - assay type
 * @returns an icon of the assay's respective color
 */
export function AssayIcon(type: string) {
  const color = assayColorMap[type];
  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "20%",
        bgcolor: color,
      }}
    />
  );
}

/**
 * Mapping from JSON assay keys to display names.
 * This is the single source of truth for assay name formatting.
 */
const assayJsonToDisplay: Record<string, string> = {
  dnase: "DNase",
  atac: "ATAC",
  h3k4me3: "H3K4me3",
  h3k27ac: "H3K27ac",
  ctcf: "CTCF",
  chromhmm: "ChromHMM",
  ccre: "cCRE",
  rnaseq: "RNA-seq",
  wgbs: "WGBS",
};

/**
 * Convert JSON assay key to display name.
 * Used only during data loading to normalize assay names.
 */
export function formatAssayType(jsonKey: string): string {
  return assayJsonToDisplay[jsonKey.toLowerCase()] ?? jsonKey;
}
