import type { TableColDef, useTablePlotSync } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";
import type { Assembly, CcreAssay, CcreClass } from "common/types/globalTypes";
import type { Dispatch, SetStateAction } from "react";

export type BiosampleRow = {
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology: string;
  class: CcreClass;
  collection: "core" | "partial" | "ancillary";
  dnase?: number;
  dnaseAccession?: string;
  atac?: number;
  atacAccession?: string;
  h3k4me3?: number;
  h3k4me3Accession?: string;
  h3k27ac?: number;
  h3k27acAccession?: string;
  ctcf?: number;
  ctcfAccession?: string;
  tf?: string;
};

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
  tableProps: ReturnType<typeof useTablePlotSync<BiosampleRow>>["tableProps"];
  /**
   * True when rows are presorted, and sorting should not be allowed on the table
   */
  isPresorted: boolean;
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
  assay: CcreAssay;
  assembly: Assembly;
  ref?: React.RefObject<DownloadPlotHandle>;
};
