import type { BiosampleTrackContext } from "./Folders/biosamples/shared/toTrack";
import type { GeneTrackContext } from "./Folders/genes/shared/toTrack";
import type { MohdTrackContext } from "./Folders/mohd/shared/toTrack";
import type { OtherTracksTrackContext } from "./Folders/other-tracks/shared/toTrack";
import type { PsychscreenTrackContext } from "./Folders/psychscreen/shared/toTrack";

export type TrackSelectTrackContext = GeneTrackContext &
  BiosampleTrackContext &
  MohdTrackContext &
  PsychscreenTrackContext &
  OtherTracksTrackContext;
