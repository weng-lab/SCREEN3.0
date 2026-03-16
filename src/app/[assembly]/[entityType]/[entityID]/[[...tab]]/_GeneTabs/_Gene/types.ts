import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { useGeneExpression } from "common/hooks/useGeneExpression";
import type { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type { Assembly } from "common/types/globalTypes";

type GeneExpressionReturnItem = ReturnType<typeof useGeneExpression>["data"][number]

// Define type which flattens the replicates array into normal properties of the data point
// Each point contains a single tpm value, file_accession/biorep/techrep will be null if averaging tpm
export type PointMetadata = Omit<GeneExpressionReturnItem, "replicates"> &
  GeneExpressionReturnItem["replicates"][number];

/** Extract the raw TPM value from a row's nested quantification structure */
export const getTPM = (d: PointMetadata): number => d.tpm;

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
  geneName: string;
  assembly: Assembly;
  getRowId: (item: PointMetadata) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionViolinPlot */
export type GeneExpressionViolinPlotProps = GeneExpressionControlProps & {
  rows: PointMetadata[];
  selected: PointMetadata[];
  setSelected: Dispatch<SetStateAction<PointMetadata[]>>;
  toggleSelection: (item: PointMetadata) => void;
  geneName: string;
  assembly: Assembly;
  loading: boolean;
  getRowId: (item: PointMetadata) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionUMAP */
export type GeneExpressionUMAPProps = {
  geneName: string;
  rows: PointMetadata[];
  highlightedAccessions: Set<string>;
  onPointToggle: (item: PointMetadata) => void;
  onLassoSelect: (items: PointMetadata[]) => void;
  loading: boolean;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for GeneExpressionTable */
export type GeneExpressionTableProps = {
  rows: PointMetadata[];
  label: string;
  loading: boolean;
  error: boolean;
  tableProps: ReturnType<typeof useTablePlotSync<PointMetadata>>["tableProps"];
  /**
   * True when rows are presorted, and sorting should not be allowed on the table
   */
  isPresorted: boolean;
  scale: GeneExpressionScale;
};
