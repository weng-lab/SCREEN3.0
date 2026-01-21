import { DisplayMode, Rect, Track, TrackType } from "@weng-lab/genomebrowser";
import { defaultBigBed, defaultTranscript } from "./defaultConfigs";
import CCRETooltip from "../Tooltips/CcreTooltip";
import { JSX } from "react";

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
  ccreTooltip: (rect: Rect) => JSX.Element;
}

// Helper to inject callbacks based on track type
export function injectCallbacks(track: Track, callbacks: TrackCallbacks): Track {
  if (track.trackType === TrackType.Transcript) {
    return {
      ...track,
      onHover: callbacks.onHover,
      onLeave: callbacks.onLeave,
      onClick: callbacks.onGeneClick,
    };
  }
  if (track.trackType === TrackType.BigBed) {
    return {
      ...track,
      onHover: callbacks.onHover,
      onLeave: callbacks.onLeave,
      onClick: callbacks.onCCREClick,
      tooltip: callbacks.ccreTooltip,
    };
  }
  return track;
}
