import { Track } from '@weng-lab/genomebrowser';
import { Assembly, FolderDefinition } from './Folders/types';
import { TrackSelectTrackContext } from './trackContext';
export declare const diffManagedTracks: ({ assembly, currentTracks, folders, selectedByFolder, trackContext, }: {
    assembly: Assembly;
    currentTracks: Track[];
    folders: FolderDefinition[];
    selectedByFolder: Map<string, Set<string>>;
    trackContext?: TrackSelectTrackContext;
}) => {
    idsToRemove: string[];
    tracksToAdd: Track[];
};
