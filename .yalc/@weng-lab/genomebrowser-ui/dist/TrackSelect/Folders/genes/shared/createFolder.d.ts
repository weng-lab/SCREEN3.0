import { FolderDefinition } from '../../types';
import { GeneDataFile, GeneRowInfo } from './types';
export interface CreateGeneFolderOptions {
    id: string;
    label: string;
    description?: string;
    data: GeneDataFile;
}
/** Build a gene folder with its row lookup, tree, and track factory. */
export declare function createGeneFolder(options: CreateGeneFolderOptions): FolderDefinition<GeneRowInfo>;
