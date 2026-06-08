import { GridColDef } from '@mui/x-data-grid-premium';
import { PsychscreenTrackInfo } from './types';
export declare const psychscreenCategoryColors: Record<string, string>;
export declare function getPsychscreenCategoryColor(category: string): string;
export declare const defaultColumns: GridColDef<PsychscreenTrackInfo>[];
export declare const defaultGroupingModel: string[];
export declare const defaultLeafField = "title";
