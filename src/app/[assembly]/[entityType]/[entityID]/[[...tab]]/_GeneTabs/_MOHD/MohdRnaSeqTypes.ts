import type { useTablePlotSync } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import { mohdSexColors, mohdSiteColors, mohdStatusColors } from "common/colors";

export type MohdRnaSeqRow = {
  value: number;
  umap_x: number;
  umap_y: number;
  kit: string;
  sample_id: string;
  sex: string;
  site: string;
  status: string;
};

export type MohdRnaSeqScale = "linear" | "log";

/** Get the display value for a row, respecting the current scale */
export const getScaledValue = (d: MohdRnaSeqRow, scale: MohdRnaSeqScale): number =>
  scale === "log" ? Math.log10(d.value + 1) : d.value;

export type BarColorBy = "sex" | "site" | "status";
export type UmapColorBy = "expression" | "sex" | "site" | "status";

export const colorMaps: Record<BarColorBy, Record<string, string>> = {
  sex: mohdSexColors,
  site: mohdSiteColors,
  status: mohdStatusColors,
};

export const getCategoryColor = (row: MohdRnaSeqRow, colorBy: BarColorBy): string =>
  colorMaps[colorBy][row[colorBy]] ?? "#999999";

export type MohdRnaSeqTableProps = {
  rows: MohdRnaSeqRow[];
  tableProps: ReturnType<typeof useTablePlotSync<MohdRnaSeqRow>>["tableProps"];
  loading: boolean;
  error: boolean;
  scale: MohdRnaSeqScale;
};

export type MohdRnaSeqBarPlotProps = {
  sortedFilteredData: MohdRnaSeqRow[];
  selected: MohdRnaSeqRow[];
  toggleSelection: (item: MohdRnaSeqRow) => void;
  getRowId: (item: MohdRnaSeqRow) => string;
  scale: MohdRnaSeqScale;
  setScale: (scale: MohdRnaSeqScale) => void;
  topAxisLabel: string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

export type MohdRnaSeqUMAPProps = {
  rows: MohdRnaSeqRow[];
  selected: MohdRnaSeqRow[];
  setSelected: React.Dispatch<React.SetStateAction<MohdRnaSeqRow[]>>;
  toggleSelection: (item: MohdRnaSeqRow) => void;
  getRowId: (item: MohdRnaSeqRow) => string;
  loading: boolean;
  ref?: React.RefObject<DownloadPlotHandle>;
};
