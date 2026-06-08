import {
  DisplayMode,
  Track,
  TrackType,
  Transcript,
  TranscriptConfig,
} from "@weng-lab/genomebrowser";
import type { FC } from "react";
import { CreateTrackOptions } from "../../types";
import { GeneRowInfo } from "./types";

export type GeneTrackContext = {
  onGeneClick?: (args: {
    trackId: string;
    row: GeneRowInfo;
    transcript: Transcript;
  }) => void;
  onGeneHover?: (args: {
    trackId: string;
    row: GeneRowInfo;
    transcript: Transcript;
  }) => void;
  geneTooltip?: FC<Transcript>;
};

const defaultTranscript: Omit<TranscriptConfig, "id" | "assembly" | "version"> =
  {
    title: "GENCODE Genes",
    trackType: TrackType.Transcript,
    displayMode: DisplayMode.Squish,
    height: 100,
    color: "#0c184a",
    canonicalColor: "#100e98",
    highlightColor: "#3c69e8",
    titleSize: 12,
  };

export function createGeneTrack(
  row: GeneRowInfo,
  options: CreateTrackOptions,
): Track {
  const trackContext = options.trackContext;

  return {
    ...defaultTranscript,
    id: row.id,
    assembly: options.assembly,
    version: row.versions[row.versions.length - 1],
    onClick: trackContext?.onGeneClick
      ? (transcript: Transcript) =>
          trackContext.onGeneClick?.({ trackId: row.id, row, transcript })
      : undefined,
    onHover: trackContext?.onGeneHover
      ? (transcript: Transcript) =>
          trackContext.onGeneHover?.({ trackId: row.id, row, transcript })
      : undefined,
    tooltip: trackContext?.geneTooltip,
  };
}
