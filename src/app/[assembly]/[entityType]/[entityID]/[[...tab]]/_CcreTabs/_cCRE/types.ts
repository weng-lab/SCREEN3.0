import type { TableColDef } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";
import type { CcreAssay, CcreClass } from "common/types/globalTypes";
import type { Dispatch, SetStateAction } from "react";
import type { useTablePlotSync } from "common/hooks/useTablePlotSync";

export type BiosampleRow = {
  name?: string;
  displayname: string;
  sampleType?: string;
  lifeStage?: string;
  ontology?: string;
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
  entity: AnyOpenEntity;
  tableProps: ReturnType<typeof useTablePlotSync<BiosampleRow>>["tableProps"];
  viewBy: ViewBy;
};

/** Props for the AssayBarPlot component */
export type AssayBarPlotProps = {
  sortedFilteredData: BiosampleRow[];
  selected: BiosampleRow[];
  toggleSelection: (item: BiosampleRow) => void;
  assay: CcreAssay;
  entity: AnyOpenEntity;
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
  assay: CcreAssay;
  entity: AnyOpenEntity;
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
  assay: CcreAssay;
  entity: AnyOpenEntity;
  ref?: React.RefObject<DownloadPlotHandle>;
};
