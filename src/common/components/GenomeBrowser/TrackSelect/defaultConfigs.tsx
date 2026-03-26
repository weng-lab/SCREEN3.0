import {
  BigWigConfig,
  TrackType,
  DisplayMode,
  BigBedConfig,
  MethylCConfig,
  TranscriptConfig,
} from "@weng-lab/genomebrowser";

export const defaultBigWig: Omit<BigWigConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigWig,
  height: 50,
  displayMode: DisplayMode.Full,
  titleSize: 12,
};

export const defaultBigBed: Omit<BigBedConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigBed,
  height: 20,
  displayMode: DisplayMode.Dense,
  titleSize: 12,
};

export const defaultMethylC: Omit<MethylCConfig, "id" | "title" | "urls"> = {
  trackType: TrackType.MethylC,
  height: 100,
  displayMode: DisplayMode.Split,
  titleSize: 12,
  color: "#648bd8",
  colors: {
    cpg: "#648bd8",
    chg: "#ff944d",
    chh: "#ff00ff",
    depth: "#525252",
  },
};

export const defaultTranscript: Omit<TranscriptConfig, "id" | "assembly" | "version"> = {
  title: "GENCODE Genes",
  trackType: TrackType.Transcript,
  displayMode: DisplayMode.Squish,
  height: 100,
  color: "#0c184a", // screen theme default
  canonicalColor: "#615fcf", // screen theme light
  highlightColor: "#3c69e8", // bright blue
  titleSize: 12,
};
