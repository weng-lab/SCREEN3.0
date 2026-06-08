import { GridColDef } from "@mui/x-data-grid-premium";
import { OtherTrackInfo } from "./types";

const nameCol: GridColDef<OtherTrackInfo> = {
  field: "name",
  headerName: "Name",
  flex: 1,
  minWidth: 200,
};

const descriptionCol: GridColDef<OtherTrackInfo> = {
  field: "description",
  headerName: "Description",
  flex: 2,
  minWidth: 300,
};

export const defaultColumns: GridColDef<OtherTrackInfo>[] = [
  nameCol,
  descriptionCol,
];

export const defaultGroupingModel: string[] = [];

export const defaultLeafField = "id";
