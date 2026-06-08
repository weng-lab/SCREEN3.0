import { GridColDef } from "@mui/x-data-grid-premium";
import { PsychscreenTrackInfo } from "./types";

export const psychscreenCategoryColors: Record<string, string> = {
  "Epigenetic Tracks": "#9479bc",
  "Deep Learned Models": "#758c7b",
  "Pseudo bulk ATAC": "#cd8c66",
  "Evolutionary Conservation": "#c0a9e2",
  "ATAC Seq Peaks": "#9479bc",
};

export function getPsychscreenCategoryColor(category: string) {
  return psychscreenCategoryColors[category] ?? "#000000";
}

const titleCol: GridColDef<PsychscreenTrackInfo> = {
  field: "title",
  headerName: "Title",
  flex: 1,
  minWidth: 240,
};

const categoryCol: GridColDef<PsychscreenTrackInfo> = {
  field: "category",
  headerName: "Category",
  flex: 1,
  minWidth: 180,
};

const subcategoryCol: GridColDef<PsychscreenTrackInfo> = {
  field: "subcategory",
  headerName: "Subcategory",
  flex: 1,
  minWidth: 240,
};

const trackTypeCol: GridColDef<PsychscreenTrackInfo> = {
  field: "trackType",
  headerName: "Track Type",
  width: 120,
};

export const defaultColumns: GridColDef<PsychscreenTrackInfo>[] = [
  titleCol,
  categoryCol,
  subcategoryCol,
  trackTypeCol,
];

export const defaultGroupingModel = ["category", "subcategory"];

export const defaultLeafField = "title";
