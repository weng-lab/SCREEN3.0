import type { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type { DownloadPlotHandle } from "@weng-lab/visualization";

export type MohdAtacRow = {
  value: number;
  umap_x: number;
  umap_y: number;
  opc_id: string;
  protocol: string;
  sample_id: string;
  sex: string;
  site: string;
  status: string;
};

export type BarColorBy = "protocol" | "sex" | "site" | "status";
export type UmapColorBy = "zscore" | "protocol" | "sex" | "site" | "status";
export type ScoreColorMode = "active" | "all";

export const protocolColors: Record<string, string> = {
  "Buffy Coat method": "#d1495b",
  "OPC method": "#00798c",
  "CPT method": "#edae49",
};

export const sexColors: Record<string, string> = {
  female: "#9d5ca3",
  male: "#62A35C",
};

export const siteColors: Record<string, string> = {
  CCH: "#BF3831",
  CKD: "#79B4F0",
  EXP: "#159875",
  MOM: "#CDA0E8",
  UIC: "#31487D",
};

export const statusColors: Record<string, string> = {
  case: "#e41a1c",
  control: "#377eb8",
  unknown: "lightgray",
};

export const colorMaps: Record<BarColorBy, Record<string, string>> = {
  protocol: protocolColors,
  sex: sexColors,
  site: siteColors,
  status: statusColors,
};

export const getCategoryColor = (row: MohdAtacRow, colorBy: BarColorBy): string =>
  colorMaps[colorBy][row[colorBy]] ?? "#999999";

export type MohdAtacTableProps = {
  rows: MohdAtacRow[];
  tableProps: ReturnType<typeof useTablePlotSync<MohdAtacRow>>["tableProps"];
  loading: boolean;
  error: boolean;
};

export type MohdAtacBarPlotProps = {
  sortedFilteredData: MohdAtacRow[];
  selected: MohdAtacRow[];
  toggleSelection: (item: MohdAtacRow) => void;
  getRowId: (item: MohdAtacRow) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

export type MohdAtacUMAPProps = {
  rows: MohdAtacRow[];
  selected: MohdAtacRow[];
  setSelected: React.Dispatch<React.SetStateAction<MohdAtacRow[]>>;
  toggleSelection: (item: MohdAtacRow) => void;
  getRowId: (item: MohdAtacRow) => string;
  loading: boolean;
  ref?: React.RefObject<DownloadPlotHandle>;
};
