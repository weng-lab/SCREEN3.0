export type LinkedGeneInfo = {
  p_val?: number | null;
  gene: string;
  geneid: string;
  genetype: string;
  method: string;
  accession: string;
  grnaid?: string | null;
  effectsize?: number | null;
  assay?: string | null;
  celltype?: string | null;
  experiment_accession?: string | null;
  tissue?: string | null;
  score?: number | null;
  variantid?: string | null;
  source?: string | null;
  slope?: number | null;
  displayname?: string | null;
};
