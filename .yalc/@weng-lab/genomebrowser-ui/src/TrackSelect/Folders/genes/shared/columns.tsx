import { GridColDef } from "@mui/x-data-grid-premium";
import { GeneRowInfo } from "./types";

/**
 * Format versions array as comma-separated string with "v" prefix
 * e.g., [29, 40] -> "v29, v40"
 */
function formatVersions(versions: number[]): string {
  return versions.map((v) => `v${v}`).join(", ");
}

const displayNameCol: GridColDef<GeneRowInfo> = {
  field: "displayName",
  headerName: "Name",
  flex: 1,
  minWidth: 200,
};

const versionsCol: GridColDef<GeneRowInfo> = {
  field: "versions",
  headerName: "Versions",
  width: 150,
  valueFormatter: (value: number[]) => value && formatVersions(value),
};

/**
 * Default columns for genes DataGrid (flat list, no grouping)
 */
export const defaultColumns: GridColDef<GeneRowInfo>[] = [
  displayNameCol,
  versionsCol,
];

/**
 * No grouping for genes - flat list
 */
export const defaultGroupingModel: string[] = [];

/**
 * Leaf field - the raw track ID (without folder prefix) used as the tree view leaf label
 */
export const defaultLeafField = "trackId";
