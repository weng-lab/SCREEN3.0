import { GridColDef } from "@mui/x-data-grid-premium";
import { FolderView } from "../../types";
import { MohdRowInfo } from "./types";

const descriptionCol: GridColDef<MohdRowInfo> = {
  field: "description",
  headerName: "Description",
  minWidth: 220,
  flex: 1.5,
};

const sampleIdCol: GridColDef<MohdRowInfo> = {
  field: "sampleId",
  headerName: "Sample ID",
  minWidth: 180,
  flex: 1,
};

const kitIdCol: GridColDef<MohdRowInfo> = {
  field: "kitId",
  headerName: "Kit ID",
  minWidth: 140,
  flex: 1,
};

const trackCategoryCol: GridColDef<MohdRowInfo> = {
  field: "trackCategory",
  headerName: "Track Type",
  minWidth: 140,
  width: 140,
};

const omeCol: GridColDef<MohdRowInfo> = {
  field: "ome",
  headerName: "Ome",
  minWidth: 120,
  width: 120,
};

const siteCol: GridColDef<MohdRowInfo> = {
  field: "site",
  headerName: "Site",
  minWidth: 100,
  width: 100,
};

const sexCol: GridColDef<MohdRowInfo> = {
  field: "sex",
  headerName: "Sex",
  minWidth: 120,
  width: 120,
};

const statusCol: GridColDef<MohdRowInfo> = {
  field: "status",
  headerName: "Status",
  minWidth: 120,
  flex: 1,
};

export const mohdColumns: GridColDef<MohdRowInfo>[] = [
  descriptionCol,
  trackCategoryCol,
  sampleIdCol,
  kitIdCol,
  omeCol,
  siteCol,
  sexCol,
  statusCol,
];

export const mohdViews: FolderView[] = [
  {
    id: "ome",
    label: "Ome",
    columns: mohdColumns,
    groupingModel: ["ome", "site", "sampleId"],
    leafField: "description",
  },
  {
    id: "site",
    label: "Site",
    columns: mohdColumns,
    groupingModel: ["site", "ome", "sampleId"],
    leafField: "description",
  },
];
