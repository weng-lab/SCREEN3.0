import type { Dispatch, SetStateAction } from "react";
import type { DownloadPlotHandle } from "@weng-lab/visualization";
import type { UseTranscriptExpressionReturn } from "common/hooks/useTranscriptExpression";
import type { EntityViewComponentProps } from "common/entityTabsConfig";
import type { useTablePlotSync } from "common/hooks/useTablePlotSync";

export type TranscriptMetadata = UseTranscriptExpressionReturn["data"][number];

export type TranscriptExpressionViewBy = "value" | "tissue" | "tissueMax";
export type TranscriptExpressionScale = "linear" | "log";

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
  viewBy: TranscriptExpressionViewBy;
  scale: TranscriptExpressionScale;
  selectedPeak: string;
  setPeak: (newPeak: string) => void;
};

/** Props for TranscriptExpressionBarPlot */
export type TranscriptExpressionBarPlotProps = TranscriptExpressionControlProps & {
  sortedFilteredData: TranscriptMetadata[];
  selected: TranscriptMetadata[];
  toggleSelection: (item: TranscriptMetadata) => void;
  entity: EntityViewComponentProps["entity"];
  ref?: React.RefObject<DownloadPlotHandle>;
};

/** Props for TranscriptExpressionViolinPlot */
export type TranscriptExpressionViolinPlotProps = TranscriptExpressionControlProps & {
  rows: TranscriptMetadata[];
  selected: TranscriptMetadata[];
  setSelected: Dispatch<SetStateAction<TranscriptMetadata[]>>;
  toggleSelection: (item: TranscriptMetadata) => void;
  entity: EntityViewComponentProps["entity"];
  ref?: React.RefObject<DownloadPlotHandle>;
};
