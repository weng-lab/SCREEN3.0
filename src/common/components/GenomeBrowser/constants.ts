import { BigWigConfig, DisplayMode, Track, TrackType, TranscriptConfig } from "@weng-lab/genomebrowser";
import { ASSAY_COLORS } from "common/colors";
import { defaultTranscript } from "./TrackSelect/defaultConfigs";

export const CCRE_TRACK_COLOR = "#D05F45";
export const GENE_TRACK_COLOR = "#005500";

export const humanDefaultTracks: Track[] = [
  {
    ...defaultTranscript,
    assembly: "GRCh38",
    version: 40,
  } as TranscriptConfig,
  {
    id: "default-dnase",
    title: "Agregated DNase-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.dnase,
    height: 50,
    url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-h3k4me3",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.h3k4me3,
    height: 50,
    url: "https://downloads.wenglab.org/H3K4me3_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-h3k27ac",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.h3k27ac,
    height: 50,
    url: "https://downloads.wenglab.org/H3K27ac_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-ctcf",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.ctcf,
    height: 50,
    url: "https://downloads.wenglab.org/CTCF_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
  {
    id: "default-atac",
    title: "Aggregated ATAC-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.atac,
    height: 50,
    url: "https://downloads.wenglab.org/ATAC_All_ENCODE_MAR20_2024_merged.bw",
  } as BigWigConfig,
];

export const mouseDefaultTracks: Track[] = [
  {
    id: "default-dnase",
    title: "Aggregated DNase-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.dnase,
    height: 50,
    url: "https://downloads.wenglab.org/DNase_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-h3k4me3",
    title: "Aggregated H3K4me3 ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.h3k4me3,
    height: 50,
    url: "https://downloads.wenglab.org/H3K4me3_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-h3k27ac",
    title: "Aggregated H3K27ac ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.h3k27ac,
    height: 50,
    url: "https://downloads.wenglab.org/H3K27ac_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-ctcf",
    title: "Aggregated CTCF ChIP-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.ctcf,
    height: 50,
    url: "https://downloads.wenglab.org/CTCF_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
  {
    id: "default-atac",
    title: "Aggregated ATAC-seq signal, all Registry biosamples",
    titleSize: 12,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    color: ASSAY_COLORS.atac,
    height: 50,
    url: "https://downloads.wenglab.org/ATAC_MM10_ENCODE_DEC2024_merged_nanrm.bigWig",
  } as BigWigConfig,
];

export const chromHmmStateDetails = {
  ["TssFlnk"]: { description: "Flanking TSS", stateno: "E1", color: "#FF4500" },
  ["TssFlnkD"]: {
    description: "Flanking TSS downstream",
    stateno: "E2",
    color: "#FF4500",
  },
  ["TssFlnkU"]: {
    description: "Flanking TSS upstream",
    stateno: "E3",
    color: "#FF4500",
  },
  ["Tss"]: { description: "Active TSS", stateno: "E4", color: "#FF0000" },
  ["Enh1"]: { description: "Enhancer", stateno: "E5", color: "#FFDF00" },
  ["Enh2"]: { description: "Enhancer", stateno: "E6", color: "#FFDF00" },
  ["EnhG1"]: {
    description: "Enhancer in gene",
    stateno: "E7",
    color: "#AADF07",
  },
  ["EnhG2"]: {
    description: "Enhancer in gene",
    stateno: "E8",
    color: "#AADF07",
  },
  ["TxWk"]: {
    description: "Weak transcription",
    stateno: "E9",
    color: "#3F9A50",
  },
  ["Biv"]: { description: "Bivalent", stateno: "E10", color: "#CD5C5C" },
  ["ReprPC"]: {
    description: "Repressed by Polycomb",
    stateno: "E11",
    color: "#8937DF",
  },
  ["Quies"]: { description: "Quiescent", stateno: "E12", color: "#DCDCDC" },
  ["Het"]: { description: "Heterochromatin", stateno: "E13", color: "#4B0082" },
  ["ZNF/Rpts"]: {
    description: "ZNF genes repreats",
    stateno: "E14",
    color: "#68cdaa",
  },
  ["Tx"]: { description: "Transcription", stateno: "E15", color: "#008000" },
};
