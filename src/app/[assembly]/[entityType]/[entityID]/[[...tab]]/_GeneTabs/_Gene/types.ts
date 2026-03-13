import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import type { EntityViewComponentProps } from "common/entityTabsConfig";
import type { useTablePlotSync } from "common/hooks/useTablePlotSync";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

export type GeneExpressionViewBy = "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM";
export type GeneExpressionScale = "linearTPM" | "logTPM";
export type GeneExpressionReplicates = "mean" | "all";
export type GeneExpressionRNAType = "all" | "polyA plus RNA-seq" | "total RNA-seq";

/** Shared control state passed to plot components that render GenePlotControls */
export type GeneExpressionControlProps = {
  scale: GeneExpressionScale;
  setScale: (newScale: GeneExpressionScale) => void;
  replicates: GeneExpressionReplicates;
  setReplicates: (newReplicates: GeneExpressionReplicates) => void;
  viewBy: GeneExpressionViewBy;
  setViewBy: (newView: GeneExpressionViewBy) => void;
  RNAtype: GeneExpressionRNAType;
  setRNAType: (newType: GeneExpressionRNAType) => void;
};

/** Props for GeneExpressionBarPlot */
export type GeneExpressionBarPlotProps = GeneExpressionControlProps & {
  sortedFilteredData: PointMetadata[];
  selected: PointMetadata[];
  toggleSelection: (item: PointMetadata) => void;
  entity: EntityViewComponentProps["entity"];
  isV40?: boolean;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionViolinPlot */
export type GeneExpressionViolinPlotProps = GeneExpressionControlProps & {
  rows: PointMetadata[];
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  toggleSelection: (item: PointMetadata) => void;
  entity: EntityViewComponentProps["entity"];
  geneExpressionData: UseGeneExpressionReturn;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionUMAP */
export type GeneExpressionUMAPProps = {
  entity: EntityViewComponentProps["entity"];
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  toggleSelection: (item: PointMetadata) => void;
  geneExpressionData: UseGeneExpressionReturn;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionTable */
export type GeneExpressionTableProps = {
  rows: PointMetadata[];
  label: string;
  loading: boolean;
  error: boolean;
  tableProps: ReturnType<typeof useTablePlotSync<PointMetadata>>["tableProps"];
  viewBy: GeneExpressionViewBy;
  scale: GeneExpressionScale;
};
