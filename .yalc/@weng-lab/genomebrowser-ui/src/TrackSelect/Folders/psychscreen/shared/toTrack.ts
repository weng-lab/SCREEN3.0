import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  Track,
  TrackType,
} from "@weng-lab/genomebrowser";
import { CreateTrackOptions } from "../../types";
import { PsychscreenTrackInfo } from "./types";

export type PsychscreenTrackContext = {};

const defaultBigWig: Omit<BigWigConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigWig,
  height: 50,
  displayMode: DisplayMode.Full,
  titleSize: 12,
};

const defaultBigBed: Omit<BigBedConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigBed,
  height: 30,
  displayMode: DisplayMode.Dense,
  titleSize: 12,
};

export function createPsychscreenTrack(
  row: PsychscreenTrackInfo,
  _options: CreateTrackOptions,
): Track {
  if (row.trackType === "bigbed") {
    return {
      ...defaultBigBed,
      id: row.id,
      title: row.title,
      url: row.url,
      color: row.color ?? "#000000",
    };
  }

  return {
    ...defaultBigWig,
    id: row.id,
    title: row.title,
    url: row.url,
    color: row.color ?? "#000000",
  };
}
