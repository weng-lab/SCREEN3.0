import { FolderDefinition } from '../../types';
import { BiosampleDataFile, BiosampleRowInfo } from './types';
export interface CreateBiosampleFolderOptions {
    id: string;
    label: string;
    description?: string;
    data: BiosampleDataFile;
}
/**
 * Build a biosample folder with its data, tree builder, and track factory.
 */
export declare function createBiosampleFolder(options: CreateBiosampleFolderOptions): FolderDefinition<BiosampleRowInfo>;
