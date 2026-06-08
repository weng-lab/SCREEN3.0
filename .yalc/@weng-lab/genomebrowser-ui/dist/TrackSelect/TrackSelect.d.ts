import { TrackStoreInstance } from '@weng-lab/genomebrowser';
import { Assembly, FolderDefinition } from './Folders/types';
import { TrackSelectTrackContext } from './trackContext';
export type InitialSelectedIdsByAssembly = Partial<Record<Assembly, Record<string, string[]>>>;
export interface TrackSelectProps {
    assembly: Assembly;
    folders: FolderDefinition[];
    initialSelectedIds?: InitialSelectedIdsByAssembly;
    sessionStorageKey?: string;
    trackStore?: TrackStoreInstance;
    onCancel?: () => void;
    maxTracks?: number;
    trackContext?: TrackSelectTrackContext;
    open: boolean;
    onClose: () => void;
    title?: string;
}
export default function TrackSelect({ assembly, folders, initialSelectedIds, sessionStorageKey, trackStore, onCancel, maxTracks, trackContext, open, onClose, title, }: TrackSelectProps): import("react/jsx-runtime").JSX.Element;
