import { GridColDef } from '@mui/x-data-grid-premium';
import { GeneRowInfo } from './types';
/**
 * Default columns for genes DataGrid (flat list, no grouping)
 */
export declare const defaultColumns: GridColDef<GeneRowInfo>[];
/**
 * No grouping for genes - flat list
 */
export declare const defaultGroupingModel: string[];
/**
 * Leaf field - the raw track ID (without folder prefix) used as the tree view leaf label
 */
export declare const defaultLeafField = "trackId";
