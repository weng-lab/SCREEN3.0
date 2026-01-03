import { DisplayMode, Rect, Track, TrackType } from "@weng-lab/genomebrowser";
import { defaultBigBed, defaultBigWig, defaultTranscript } from "./defaultConfigs";
import CCRETooltip from "../Tooltips/CcreTooltip";
import { ASSAY_COLORS } from "common/colors";

export const defaultHumanTracks: Track[] = [
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
    ...defaultBigWig,
    color: ASSAY_COLORS.dnase,
    id: "human-dnase-aggregate-ignore",
    title: "Aggregated DNase signal, all ENCODE biosamples",
    url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.h3k4me3,
    id: "human-h3k4me3-aggregate-ignore",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/H3K4me3_All_ENCODE_MAR20_2024_merged.bw",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.h3k27ac,
    id: "human-h3k27ac-aggregate-ignore",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/H3K27ac_All_ENCODE_MAR20_2024_merged.bw",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.ctcf,
    id: "human-ctcf-aggregate-ignore",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/CTCF_All_ENCODE_MAR20_2024_merged.bw",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.atac,
    id: "human-atac-aggregate-ignore",
    title: "Aggregated ATAC signal, all Registry biosamples",
    titleSize: 12,
    url: "https://downloads.wenglab.org/ATAC_All_ENCODE_MAR20_2024_merged.bw",
  },
];
export const gwasTracks: Track[] = [
  defaultHumanTracks[0],
  defaultHumanTracks[1],
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
export const defaultMouseTracks: Track[] = [
  {
    ...defaultTranscript,
    color: "#D05F45",
    id: "mouse-genes-ignore",
    assembly: "mm10",
    version: 21,
  },
  {
    ...defaultBigBed,
    id: "mouse-ccre-ignore",
    title: "All cCREs colored by group",
    url: "https://downloads.wenglab.org/mm10-cCREs.DCC.bigBed",
    color: "#D05F45",
    tooltip: (rect: Rect) => <CCRETooltip assembly={"mm10"} name={rect.name} {...rect} />,
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.dnase,
    id: "mouse-dnase-aggregate-ignore",
    title: "Aggregated DNase signal, all ENCODE biosamples",
    url: "https://downloads.wenglab.org/DNase_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.h3k4me3,
    id: "mouse-h3k4me3-aggregate-ignore",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/H3K4me3_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.h3k27ac,
    id: "mouse-h3k27ac-aggregate-ignore",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/H3K27ac_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.ctcf,
    id: "mouse-ctcf-aggregate-ignore",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    url: "https://downloads.wenglab.org/CTCF_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  },
  {
    ...defaultBigWig,
    color: ASSAY_COLORS.atac,
    id: "mouse-atac-aggregate-ignore",
    title: "Aggregated ATAC-seq signal, all Registry biosamples",
    titleSize: 12,
    url: "https://downloads.wenglab.org/ATAC_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
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
    };
  }
  return track;
}
