import { FolderDefinition } from '../../types';
import { PsychscreenDataFile, PsychscreenTrackInfo } from './types';
export interface CreatePsychscreenFolderOptions {
    id: string;
    label: string;
    description?: string;
    data: PsychscreenDataFile;
}
export declare function createPsychscreenFolder(options: CreatePsychscreenFolderOptions): FolderDefinition<PsychscreenTrackInfo>;
