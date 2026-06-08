/**
 * Types for genes folder data
 */

/**
 * Gene track information from the JSON data
 */
export type GeneTrackInfo = {
  /** Unique identifier for this gene track */
  id: string;
  /** Display name shown in the UI */
  displayName: string;
  /** Available versions for this gene annotation */
  versions: number[];
};

/**
 * Row format for DataGrid (same as track info for genes since it's flat)
 */
export type GeneRowInfo = {
  id: string;
  /** The raw track ID without the folder prefix, used as the tree view leaf label */
  trackId: string;
  displayName: string;
  versions: number[];
};

/**
 * Structure of the gene JSON data files (direct array)
 */
export type GeneDataFile = GeneTrackInfo[];
