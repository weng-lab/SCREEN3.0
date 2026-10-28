import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { UseTranscriptExpressionReturn } from "common/hooks/data/gene";
import type { useTablePlotSync } from "@weng-lab/ui-components";
import { capitalizeWords } from "common/utils";

export type TranscriptMetadata = UseTranscriptExpressionReturn["data"][number];

export type TranscriptExpressionViewBy = "value" | "tissue" | "tissueMax";
export type TranscriptExpressionScale = "linear" | "log";

export const getRPM = (d: TranscriptMetadata): number => d.value ?? 0;

export const getLogRPM = (d: TranscriptMetadata): number => Math.log10(getRPM(d) + 1);

export const getScaledRPM = (d: TranscriptMetadata, scale: TranscriptExpressionScale): number =>
  scale === "log" ? getLogRPM(d) : getRPM(d);

/** A sample's hover on every TSS plot, with its value in the plot's scale. */
export const tssTooltip = (row: TranscriptMetadata, value: number, scale: TranscriptExpressionScale) => ({
  title: capitalizeWords(row.biosampleSummary.replaceAll("_", " ")),
  rows: [
    { label: "Accession", value: row.expAccession },
    { label: "Organ/Tissue", value: capitalizeWords(row.organ) },
    { label: "Sample Type", value: capitalizeWords(row.biosampleType) },
    { label: "Strand", value: row.strand },
    { label: scale === "linear" ? "RPM" : "Log₁₀(RPM + 1)", value: value.toFixed(2) },
  ],
});

/** Shared control state passed to plot components that render TranscriptPlotControls */
export type TranscriptExpressionControlProps = {
  scale: TranscriptExpressionScale;
  setScale: (newScale: TranscriptExpressionScale) => void;
  viewBy: TranscriptExpressionViewBy;
  setViewBy: (newView: TranscriptExpressionViewBy) => void;
  selectedPeak: string;
  setPeak: (newPeak: string) => void;
  transcriptExpressionData: UseTranscriptExpressionReturn;
};

/** Props for TranscriptExpressionTable */
export type TranscriptExpressionTableProps = {
  rows: TranscriptMetadata[];
  transcriptExpressionData: UseTranscriptExpressionReturn;
  tableProps: ReturnType<typeof useTablePlotSync<TranscriptMetadata>>["tableProps"];
  scale: TranscriptExpressionScale;
  selectedPeak: string;
  setPeak: (newPeak: string) => void;
};

/** Props for TranscriptExpressionBarPlot */
export type TranscriptExpressionBarPlotProps = TranscriptExpressionControlProps & {
  sortedFilteredData: TranscriptMetadata[];
  selected: TranscriptMetadata[];
  toggleSelection: (item: TranscriptMetadata) => void;
  getRowId: (item: TranscriptMetadata) => string;
  geneName: string;
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for TranscriptExpressionViolinPlot */
export type TranscriptExpressionViolinPlotProps = TranscriptExpressionControlProps & {
  rows: TranscriptMetadata[];
  selected: TranscriptMetadata[];
  setSelected: Dispatch<SetStateAction<TranscriptMetadata[]>>;
  toggleSelection: (item: TranscriptMetadata) => void;
  getRowId: (item: TranscriptMetadata) => string;
  geneName: string;
  ref?: React.RefObject<DownloadPlotHandle>;
};
