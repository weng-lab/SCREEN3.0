export type CollectionType = "Core" | "Ancillary" | "Partial" | "NA";

/**
 * One assay entry from the source data. WGBS rows carry strand-specific URLs.
 */
export type BiosampleAssayInfo = {
  id: string;
  assay: string;
  url?: string;
  experimentAccession: string;
  fileAccession?: string;
  cpgPlus?: string;
  cpgMinus?: string;
  coverage?: string;
};

/** One biosample entry from the source data. */
export type BiosampleTrackInfo = {
  name: string;
  ontology: string;
  lifeStage: string;
  sampleType: string;
  displayName: string;
  assays: BiosampleAssayInfo[];
  collection: CollectionType;
};

/**
 * Flattened table row used by TrackSelect and track creation.
 */
export type BiosampleRowInfo = {
  id: string;
  ontology: string;
  lifeStage: string;
  sampleType: string;
  displayName: string;
  assay: string;
  experimentAccession: string;
  fileAccession?: string;
  url?: string;
  collection: CollectionType;
  cpgPlus?: string;
  cpgMinus?: string;
  coverage?: string;
};

/** Root shape for biosample JSON files. */
export type BiosampleDataFile = {
  tracks: BiosampleTrackInfo[];
};
