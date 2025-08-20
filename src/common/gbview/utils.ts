export function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function trackColor(lineage: string) {
  switch (lineage) {
    case "Bcells":
      return "#0000ff";
    case "CD4_Tcells":
      return "#980000";
    case "CD8_Tcells":
      return "#ff9900";
    case "Bulk_Tcells":
      return "#ff0000";
    case "gd_Tcells":
      return "#fa0056";
    case "NK":
      return "#38761d";
    case "Myeloid":
      return "#9900ff";
    case "Progenitors":
      return "#666666";
    case "Leukemia":
      return "#25e6c9";
    case "Erythroblasts":
      return "#684fda";
  }
}


export function lineageName(lineage: string) {
  switch (lineage) {
    case "Bcells":
      return "B cells";
    case "CD4_Tcells":
      return "CD4+ T cells";
    case "CD8_Tcells":
      return "CD8+ T cells";
    case "Bulk_Tcells":
      return "Bulk T cells";
    case "gd_Tcells":
      return "gd_T cells";
    case "NK":
      return "NK cells";
    case "Myeloid":
      return "Myeloid cells";
    case "Progenitors":
      return "Progenitors";
    case "Leukemia":
      return "Leukemia";
    case "Erythroblasts":
      return "Erythroblasts";
  }
}
