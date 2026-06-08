import { Assembly } from '../../types';
export type { Assembly };
export declare const assayTypes: string[];
export declare const lifeStages: string[];
export declare const ontologyTypes: string[];
/** Color mapping for assay types */
export declare const assayColorMap: {
    [key: string]: string;
};
/**
 * Creates the assay icon for DataGrid and RichTreeView
 * @param type - assay type
 * @returns an icon of the assay's respective color
 */
export declare function AssayIcon(type: string): import("react/jsx-runtime").JSX.Element;
/**
 * Convert JSON assay key to display name.
 * Used only during data loading to normalize assay names.
 */
export declare function formatAssayType(jsonKey: string): string;
