import { GenomicElementType } from "types/globalTypes"

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

export const portalDescriptions: {[key in (GenomicElementType | "phenotype" | "lineage")]: string} = {
  icre: "Explore regulatory element activity (immune cCREs) across immune cell types at bulk and single-cell resolution for 63 cell types across 736 experiments.",
  gene: "Explore gene expression across immune cell types at bulk and single-cell resolution for 43 cell types across 312 experiments.",
  variant: "Search variants of interest and explore their impact on gene expression, chromatin accessibility, and other molecular traits in immune cells.",
  phenotype: "Select between 400 phenotypes to explore heritability enrichment (calculated by LD score regression) within 736 immune cell experiments.",
  lineage: "Compare immune cCRE activity between immune cell types.",
  // don't have a region search portal page
  region: ""
}

export const portalImagePaths: {[key in (GenomicElementType | "phenotype" | "lineage")]: string} = {
  icre: "/assets/iCREPortal.png",
  gene: "/assets/GenePortal.png",
  variant: "/assets/SNPPortal.png",
  phenotype: "/assets/PhenotypePage.png",
  lineage: "/assets/LineagePage.png",
  // don't have a region search portal page
  region: ""
}