export type MainQueryData = {
  data: {
    cCRESCREENSearch: SCREENSearchResult[];
  };
};

type SCREENCellTypeSpecificResponse = {
  __typename: "SCREENCellTypeSpecificResponse";
  ct: null | any; // Replace 'any' with the actual type if 'ct' has a specific type
  dnase_zscore: null | number;
  h3k4me3_zscore: null | number;
  h3k27ac_zscore: null | number;
  ctcf_zscore: null | number;
  atac_zscore: null | number;
};

type CCREInfo = {
  __typename: "CCREInfo";
  accession: string;
  isproximal: boolean;
  concordant: boolean;
};

type NearestGene = {
  gene: string;
  distance: number;
};

export type SCREENSearchResult = {
  __typename: "SCREENSearchResult";
  chrom: string;
  start: number;
  len: number;
  pct: string;
  vertebrates: number;
  mammals: number;
  primates: number;
  ctcf_zscore: number;
  dnase_zscore: number;
  enhancer_zscore: number;
  promoter_zscore: number;
  atac_zscore: number;
  ctspecific: SCREENCellTypeSpecificResponse;
  info: CCREInfo;
  nearestgenes: NearestGene[];
};
