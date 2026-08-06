import { BulkBedRect, DisplayMode, Rect, Track, TrackType } from "@weng-lab/genomebrowser";
import { defaultBigBed, defaultTranscript } from "./defaultConfigs";
import CCRETooltip from "../Tooltips/CcreTooltip";
import { JSX } from "react";

type TrackSelectRow = {
  id?: string;
  assay?: string;
  displayName?: string;
};

export type CcreTooltipBiosample = {
  name: string;
  displayname: string;
};

// GWAS-specific tracks with -ignore suffix to prevent removal by TrackSelect
export const gwasTracks: Track[] = [
  {
    ...defaultTranscript,
    color: "#0c184a",
    id: "human-genes-ignore",
    assembly: "GRCh38",
    version: 40,
  },
  {
    ...defaultBigBed,
    color: "#0c184a",
    id: "human-ccre-ignore",
    title: "All cCREs colored by group",
    url: "https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed",
    tooltip: (rect: Rect) => <CCRETooltip assembly={"GRCh38"} name={rect.name} {...rect} />,
  },
  {
    id: "ld-track-ignore",
    title: "LD",
    trackType: TrackType.LDTrack,
    displayMode: DisplayMode.LDBlock,
    height: 50,
    titleSize: 12,
    color: "#ff0000",
  },
];

// Callback types for track interactions (using any to avoid type conflicts with library types)
// add more fields for more things to pass down and adjust injectCallbacks as needed
export interface TrackCallbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHover: (item: any) => void;
  onLeave: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCCREClick: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGeneClick: (item: any) => void;
  ccreTooltip: (rect: Rect, biosample?: CcreTooltipBiosample) => JSX.Element;
  chromHmmTooltip: (rect: BulkBedRect, tissue: string) => JSX.Element;
}

// Helper to inject callbacks based on track type
export function injectCallbacks(track: Track, callbacks: TrackCallbacks, row?: TrackSelectRow): Track {
  if (track.trackType === TrackType.Transcript) {
    return {
      ...track,
      onHover: callbacks.onHover,
      onLeave: callbacks.onLeave,
      onClick: callbacks.onGeneClick,
    };
  }
  if (track.trackType === TrackType.BigBed) {
    const assay = row?.assay?.toLowerCase();
    const isChromHmm = assay === "chromhmm" || track.id.toLowerCase().includes("chromhmm");

    if (isChromHmm) {
      const displayName = row?.displayName || track.title?.replace(/, chromhmm$/i, "") || "";
      return {
        ...track,
        onHover: callbacks.onHover,
        onLeave: callbacks.onLeave,
        tooltip: (rect: BulkBedRect) => callbacks.chromHmmTooltip(rect, displayName),
      };
    }
    return {
      ...track,
      onHover: callbacks.onHover,
      onLeave: callbacks.onLeave,
      onClick: callbacks.onCCREClick,
      tooltip: (rect: Rect) => {
        const trackMetadata = track as Track & {
          biosampleName?: string;
          biosampleDisplayName?: string;
        };

        const biosample =
          trackMetadata.biosampleName && trackMetadata.biosampleDisplayName
            ? {
                name: trackMetadata.biosampleName,
                displayname: trackMetadata.biosampleDisplayName,
              }
            : undefined;

        return callbacks.ccreTooltip(rect, biosample);
      },
    };
  }
  return track;
}
