import { GridColDef } from '@mui/x-data-grid-premium';
import { BiosampleRowInfo } from './types';
/** Columns for sorted-by-assay view (assay as top-level grouping) */
export declare const sortedByAssayColumns: GridColDef<BiosampleRowInfo>[];
/** Default columns (ontology as top-level grouping) */
export declare const defaultColumns: GridColDef<BiosampleRowInfo>[];
/** Grouping model for sorted-by-assay view */
export declare const sortedByAssayGroupingModel: string[];
/** Default grouping model (ontology-based) */
export declare const defaultGroupingModel: string[];
/** Leaf field for sorted-by-assay view */
export declare const sortedByAssayLeafField = "displayName";
/** Default leaf field */
export declare const defaultLeafField = "assay";
