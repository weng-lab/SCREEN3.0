import type { GridColDef } from "@weng-lab/ui-components";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";
import type { CcreAssay, CcreClass } from "common/types/globalTypes";
import type { Dispatch, SetStateAction } from "react";

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
  columns: GridColDef[];
  assay: CcreAssay;
  entity: AnyOpenEntity;
};

export type SharedAssayViewPlotProps = AssayViewProps & {
  selected: BiosampleRow[];
  setSelected: Dispatch<SetStateAction<BiosampleRow[]>>;
  sortedFilteredData: BiosampleRow[];
  setSortedFilteredData: Dispatch<SetStateAction<BiosampleRow[]>>;
  viewBy: "value" | "tissue" | "tissueMax";
  setViewBy: (newView: "value" | "tissue" | "tissueMax") => void;
  ref?: React.RefObject<DownloadPlotHandle>;
  cutoffLowSignal: boolean;
  setCutoffLowSignal: (cutoff: boolean) => void;
};
