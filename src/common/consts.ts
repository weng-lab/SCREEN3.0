/**
 * @todo cleanup dead igSCREEN stuff if not used
 */

export const studyLinks = {
  "Calderon..Pritchard 2019": "https://doi.org/10.1038/s41588-019-0505-9",
  "Corces..Chang 2016": "https://doi.org/10.1038/ng.3646",
  "ENCODE": "https://www.encodeproject.org/"
}

export const cellCategoryColors = {
  Bcells: "#078fff",
  Bulk_Tcells: "#e06666",
  CD4_Tcells: "#990000",
  CD8_Tcells: "#f6b26b",
  Erythroblasts: "#684fda",
  Leukemia: "#1ab19a",
  Myeloid: "#a64d79",
  NK: "#93c47d",
  Progenitors: "#d3b2ce",
  gd_Tcells: "#ff9900"
}

export const cellCategoryDisplaynames = {
  Bcells: "B Cells",
  Bulk_Tcells: "Bulk T Cells",
  CD4_Tcells: "CD4 T Cells",
  CD8_Tcells: "CD8 T Cells",
  Erythroblasts: "Erythroblasts",
  Leukemia: "Leukemic Cells",
  Myeloid: "Myeloid Cells",
  NK: "Natural Killer Cells",
  Progenitors: "Progenitor Cells",
  gd_Tcells: "Gamma Delta T Cells"
}

export const CCRE_CLASSES = ["PLS", "pELS", "dELS", "CA-H3K4me3", "CA-CTCF", "CA-TF", "CA", "TF", "InActive", "noclass"] as const;