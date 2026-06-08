import { BiosampleTrackContext } from './Folders/biosamples/shared/toTrack';
import { GeneTrackContext } from './Folders/genes/shared/toTrack';
import { MohdTrackContext } from './Folders/mohd/shared/toTrack';
import { OtherTracksTrackContext } from './Folders/other-tracks/shared/toTrack';
import { PsychscreenTrackContext } from './Folders/psychscreen/shared/toTrack';
export type TrackSelectTrackContext = GeneTrackContext & BiosampleTrackContext & MohdTrackContext & PsychscreenTrackContext & OtherTracksTrackContext;
