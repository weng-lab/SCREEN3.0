import "./muiLicense";

import TrackSelect, {
  type InitialSelectedIdsByAssembly,
  type TrackSelectProps,
} from "./TrackSelect/TrackSelect";
export { TrackSelect, TrackSelectProps };
export type { TrackSelectTrackContext } from "./TrackSelect/trackContext";
export type { InitialSelectedIdsByAssembly };

import { foldersByAssembly } from "./TrackSelect/Folders/index.ts";
export { foldersByAssembly };

export type {
  BiosampleRowInfo,
  BiosampleTrackContext,
  GeneRowInfo,
  GeneTrackContext,
  MohdRowInfo,
  MohdTrackContext,
  OtherTrackInfo,
  OtherTracksTrackContext,
} from "./TrackSelect/Folders";

import { tfPeaksTrack } from "./TrackSelect/Custom/TfPeaks.tsx";
export { tfPeaksTrack };
