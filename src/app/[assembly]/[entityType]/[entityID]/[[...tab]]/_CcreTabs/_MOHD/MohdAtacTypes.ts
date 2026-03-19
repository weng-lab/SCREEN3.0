import type { useTablePlotSync } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import {
  mohdProtocolColors,
  mohdSexColors,
  mohdSiteColors,
  mohdStatusColors,
} from "common/colors";

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

export const colorMaps: Record<BarColorBy, Record<string, string>> = {
  protocol: mohdProtocolColors,
  sex: mohdSexColors,
  site: mohdSiteColors,
  status: mohdStatusColors,
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
