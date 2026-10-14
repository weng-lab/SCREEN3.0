import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { useGeneExpression } from "common/hooks/data/gene";
import type { SyncedTableProps, TableColDef, TableFilters } from "@weng-lab/ui-components";
import type { Assembly } from "common/types/globalTypes";
import { capitalizeFirstLetter } from "common/utils";

type GeneExpressionReturnItem = ReturnType<typeof useGeneExpression>["data"][number];

// Define type which flattens the replicates array into normal properties of the data point
// Each point contains a single tpm value, file_accession/biorep/techrep will be null if averaging tpm
export type PointMetadata = Omit<GeneExpressionReturnItem, "replicates"> &
  GeneExpressionReturnItem["replicates"][number];

/** Extract the raw TPM value from a row's nested quantification structure */
export const getTPM = (d: PointMetadata): number => d.tpm;

/** Extract the log10-transformed TPM value: log10(TPM + 1) */
export const getLogTPM = (d: PointMetadata): number => Math.log10(getTPM(d) + 1);

/** Get TPM value appropriate for the current scale */
export const getScaledTPM = (d: PointMetadata, scale: GeneExpressionScale): number =>
  scale === "logTPM" ? getLogTPM(d) : getTPM(d);

/** Build a scale-appropriate axis label for expression plots */
export const getScaleLabel = (geneName: string, scale: GeneExpressionScale): string =>
  scale === "linearTPM" ? `${geneName} Expression: TPM` : `${geneName} Expression: Log\u2081\u2080(TPM + 1)`;

/** A sample's hover on every expression plot, with its value in the plot's scale. */
export const expressionTooltip = (row: PointMetadata, value: number, scale: GeneExpressionScale) => ({
  title: capitalizeFirstLetter(row.biosample),
  rows: [
    { label: "Accession", value: row.biorep != null ? `${row.exp_accession} (rep. ${row.biorep})` : row.exp_accession },
    { label: "Organ/Tissue", value: capitalizeFirstLetter(row.tissue) },
    { label: "Sample Type", value: capitalizeFirstLetter(row.biosample_type) },
    { label: scale === "linearTPM" ? "TPM" : "Log\u2081\u2080(TPM + 1)", value: value.toFixed(2) },
  ],
});

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
  /** Experiments with any replicate selected. */
  selectedAccessions: ReadonlySet<string>;
  /** The table's filters, which the UMAP's chips edit. */
  filters: TableFilters;
  /** Whether the table lists any of an experiment's replicates. */
  isListed: (accession: string) => boolean;
  /** The table's columns, which name its filters. */
  columns: TableColDef<PointMetadata>[];
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
  tableProps: SyncedTableProps<PointMetadata>;
  columns: TableColDef<PointMetadata>[];
};
