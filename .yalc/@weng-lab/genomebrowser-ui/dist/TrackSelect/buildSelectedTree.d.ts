import { TreeViewBaseItem } from '@mui/x-tree-view';
import { ExtendedTreeItemProps } from './types';
type TreeRow = {
    id: string;
    [key: string]: unknown;
};
type BuildSelectedTreeOptions = {
    folderId: string;
    rootLabel: string;
    selectedRows: TreeRow[];
    groupingModel: string[];
    leafField: string;
};
export declare const buildSelectedTree: ({ folderId, rootLabel, selectedRows, groupingModel, leafField, }: BuildSelectedTreeOptions) => TreeViewBaseItem<ExtendedTreeItemProps>[];
export {};
