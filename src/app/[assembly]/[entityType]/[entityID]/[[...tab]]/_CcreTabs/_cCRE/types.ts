import type { SyncedTableProps, TableColDef, TableFilters } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";
import type { Assembly, CcreAssay, CcreClass } from "common/types/globalTypes";
import type { Dispatch, SetStateAction } from "react";
import type { PlotTooltipProps } from "common/components/PlotTooltip";
import { formatAssay } from "common/assays";
import { CLASS_DESCRIPTIONS } from "common/ccre";
import { capitalizeFirstLetter } from "common/utils";

export type BiosampleRow = {
  /**
   * Z-score for the assay this row was built for. Populated in
   * `assaySpecificRows` so plots can read the value directly off the row
   * instead of indexing by `assay`, which can lag behind the row data
   * (see `sortedFilteredData` in useTablePlotSync) during an assay switch.
   */
  value?: number;
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology: string;
  group: CcreClass;
  collection: "core" | "partial" | "ancillary";
  dnase?: number;
  dnaseExpAccession?: string;
  atac?: number;
  atacExpAccession?: string;
  h3k4me3?: number;
  h3k4me3ExpAccession?: string;
  h3k27ac?: number;
  h3k27acExpAccession?: string;
  ctcf?: number;
  ctcfExpAccession?: string;
  tf?: string;
};

/**
 * The table's column for the assay in view, on `value`: one field whatever the assay, so the table's
 * filters and sort on it carry over from assay to assay.
 */
export const SCORE_FIELD = "value" satisfies keyof BiosampleRow;

/** A biosample's hover on every assay plot. */
export const biosampleTooltip = (row: BiosampleRow, assay: CcreAssay): PlotTooltipProps => ({
  title: capitalizeFirstLetter(row.displayname),
  rows: [
    { label: "Organ/Tissue", value: capitalizeFirstLetter(row.ontology) },
    ...(row.sampleType ? [{ label: "Sample Type", value: capitalizeFirstLetter(row.sampleType) }] : []),
    ...(row.value != null ? [{ label: `${formatAssay(assay)} Z-score`, value: row.value.toFixed(2) }] : []),
    ...(row.group ? [{ label: "Classification", value: CLASS_DESCRIPTIONS[row.group] ?? row.group }] : []),
  ],
});

export type AssayViewProps = {
  rows: BiosampleRow[];
  columns: TableColDef[];
  assay: CcreAssay;
  entity: AnyOpenEntity;
};

export type ViewBy = "value" | "tissue" | "tissueMax";

/** Props for the AssayTable component */
export type AssayTableProps = {
  rows: BiosampleRow[];
  columns: TableColDef[];
  assay: CcreAssay;
  entityID: string;
  tableProps: SyncedTableProps<BiosampleRow>;
};

/** Props for the AssayBarPlot component */
export type AssayBarPlotProps = {
  sortedFilteredData: BiosampleRow[];
  selected: BiosampleRow[];
  toggleSelection: (item: BiosampleRow) => void;
  getRowId: (item: BiosampleRow) => string;
  assay: CcreAssay;
  entityID: string;
  viewBy: ViewBy;
  setViewBy: (view: ViewBy) => void;
  cutoffLowSignal: boolean;
  setCutoffLowSignal: (cutoff: boolean) => void;
  show95Line: boolean;
  setShow95Line: (show: boolean) => void;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for the AssayViolinPlot component */
export type AssayViolinPlotProps = {
  rows: BiosampleRow[];
  selected: BiosampleRow[];
  setSelected: Dispatch<SetStateAction<BiosampleRow[]>>;
  toggleSelection: (item: BiosampleRow) => void;
  getRowId: (item: BiosampleRow) => string;
  assay: CcreAssay;
  entityID: string;
  viewBy: ViewBy;
  setViewBy: (view: ViewBy) => void;
  cutoffLowSignal: boolean;
  setCutoffLowSignal: (cutoff: boolean) => void;
  show95Line: boolean;
  setShow95Line: (show: boolean) => void;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for the AssayUMAP component */
export type AssayUMAPProps = {
  rows: BiosampleRow[];
  selected: BiosampleRow[];
  setSelected: Dispatch<SetStateAction<BiosampleRow[]>>;
  toggleSelection: (item: BiosampleRow) => void;
  getRowId: (item: BiosampleRow) => string;
  /** The table's filters, which the UMAP's chips edit and its points follow. */
  filters: TableFilters;
  /** The table's columns, which name its filters. */
  columns: TableColDef[];
  assay: CcreAssay;
  assembly: Assembly;
  ref?: React.RefObject<DownloadPlotHandle>;
};
