import { Track } from "@weng-lab/genomebrowser";
import { tfPeaksTrack } from "../../../Custom/TfPeaks";
import { CreateTrackOptions } from "../../types";
import { OtherTrackInfo } from "./types";

export type OtherTracksTrackContext = {};

export function createOtherTrack(
  row: OtherTrackInfo,
  _options: CreateTrackOptions,
): Track | null {
  if ((row.sourceId ?? row.id) === "tf-peaks") {
    return { ...tfPeaksTrack, id: row.id };
  }

  return null;
}
