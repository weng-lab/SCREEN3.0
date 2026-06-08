import { FolderDefinition } from '../../types';
import { MohdDataFile, MohdRowInfo } from './types';
export interface CreateMohdFolderOptions {
    id: string;
    label: string;
    description?: string;
    data: MohdDataFile;
}
export declare function createMohdFolder(options: CreateMohdFolderOptions): FolderDefinition<MohdRowInfo>;
