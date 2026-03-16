import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import type { EntityViewComponentProps } from "common/entityTabsConfig";
import type { useTablePlotSync } from "common/hooks/useTablePlotSync";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

/** Extract the raw TPM value from a row's nested quantification structure */
export const getTPM = (d: PointMetadata): number => d.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0;

/** Extract the log10-transformed TPM value: log10(TPM + 1) */
export const getLogTPM = (d: PointMetadata): number => Math.log10(getTPM(d) + 1);

/** Build a scale-appropriate axis label for expression plots */
export const getScaleLabel = (geneName: string, scale: GeneExpressionScale): string =>
  scale === "linearTPM" ? `${geneName} Expression: TPM` : `${geneName} Expression: Log\u2081\u2080(TPM + 1)`;

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
  getRowId: (item: PointMetadata) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionViolinPlot */
export type GeneExpressionViolinPlotProps = GeneExpressionControlProps & {
  rows: PointMetadata[];
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  toggleSelection: (item: PointMetadata) => void;
  entity: EntityViewComponentProps["entity"];
  loading: boolean;
  getRowId: (item: PointMetadata) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionUMAP */
export type GeneExpressionUMAPProps = {
  entity: EntityViewComponentProps["entity"];
  rows: PointMetadata[];
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  toggleSelection: (item: PointMetadata) => void;
  loading: boolean;
  getRowId: (item: PointMetadata) => string;
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
