import { Assembly, FolderDefinition } from "./types";
import { humanBiosamplesFolder } from "./biosamples/human";
import { mouseBiosamplesFolder } from "./biosamples/mouse";
import { humanGenesFolder } from "./genes/human";
import { mouseGenesFolder } from "./genes/mouse";
import { humanOtherTracksFolder } from "./other-tracks/human";
import { humanMohdFolder } from "./mohd/human";
import { humanPsychscreenFolder } from "./psychscreen/human";

export { type Assembly, type FolderDefinition, type FolderView } from "./types";

export type { BiosampleRowInfo } from "./biosamples/shared/types";
export type { BiosampleTrackContext } from "./biosamples/shared/toTrack";
export type { GeneRowInfo } from "./genes/shared/types";
export type { GeneTrackContext } from "./genes/shared/toTrack";
export type { MohdRowInfo } from "./mohd/shared/types";
export type { MohdTrackContext } from "./mohd/shared/toTrack";
export type { PsychscreenTrackInfo } from "./psychscreen/shared/types";
export type { PsychscreenTrackContext } from "./psychscreen/shared/toTrack";
export type { OtherTrackInfo } from "./other-tracks/shared/types";
export type { OtherTracksTrackContext } from "./other-tracks/shared/toTrack";

// Registry of folders by assembly
export const foldersByAssembly: Record<Assembly, FolderDefinition[]> = {
  GRCh38: [
    humanGenesFolder,
    humanBiosamplesFolder,
    humanMohdFolder,
    humanPsychscreenFolder,
    humanOtherTracksFolder,
  ],
  mm10: [mouseGenesFolder, mouseBiosamplesFolder],
};
