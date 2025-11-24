import { Track, BigWigConfig, TrackType, DisplayMode, BigBedConfig, TranscriptConfig } from "@weng-lab/genomebrowser";

// temporary until we implement the UI
type Selection = {
  name: string;
  url: string;
};

export function buildBigWig(selection: Selection): Track {
  const bigWigTrack: BigWigConfig = {
    title: selection.name,
    trackType: TrackType.BigWig,
    url: selection.url,
    height: 50,
    displayMode: DisplayMode.Full,
    id: `bigWig-${selection.name}`,
  };
  return bigWigTrack;
}

export function buildBigBed(selection: Selection): Track {
  const bigBedTrack: BigBedConfig = {
    title: selection.name,
    trackType: TrackType.BigBed,
    url: selection.url,
    height: 100,
    displayMode: DisplayMode.Dense,
    id: `bigBed-${selection.name}`,
  };
  return bigBedTrack;
}

export function buildTranscript() {
  const transriptTrack: TranscriptConfig = {
    title: "GENCODE Genes",
    id: "gene",
    trackType: TrackType.Transcript,
    displayMode: DisplayMode.Squish,
    assembly: "hg38",
    version: 40,
    height: 100,
  };
  return transriptTrack;
}
