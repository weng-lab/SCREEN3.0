import { FolderDefinition } from '../../types';
import { OtherTrackDataFile, OtherTrackInfo } from './types';
export interface CreateOtherTracksFolderOptions {
    id: string;
    label: string;
    description?: string;
    data: OtherTrackDataFile;
}
export declare function createOtherTracksFolder(options: CreateOtherTracksFolderOptions): FolderDefinition<OtherTrackInfo>;
