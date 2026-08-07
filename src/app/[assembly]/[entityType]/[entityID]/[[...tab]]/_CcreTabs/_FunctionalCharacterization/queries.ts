import { gql } from "common/types/generated";

export const FUNCTIONAL_DATA_QUERY = gql(`
query functionalCharacterizationQuery($coordinates: [GenomicRangeInput!],$assembly: String!) {
  functionalCharacterizationQuery(assembly: $assembly, coordinates: $coordinates) {
    tissues
    element_id
    assay_result
    chromosome
    stop
    start
  }
}
`);

export const MPRA_FUNCTIONAL_DATA_QUERY = gql(`
query MPRA_FCC($coordinates: [GenomicRangeInput!]) {
  mpraFccQuery(coordinates: $coordinates) {
    celltype
    chromosome
    stop
    start
    assay_type
    element_location
    series
    strand
    log2fc
    experiment
    barcode_location
  }
}
`);

export const CRISPR_FUNCTIONAL_DATA_QUERY = gql(`
  query crisprFccQuery($accession: [String]!) {
    crisprFccQuery(accession: $accession) {
      rdhs
      log2fc
      fdr
      pvalue
      experiment
    }
  }
`);

export const CAPRA_SOLO_FUNCTIONAL_DATA_QUERY = gql(`
query capraFccSoloQuery($accession: [String]!) {
  capraFccSoloQuery(accession: $accession) {
    rdhs
    log2fc
    fdr
    dna_rep1
    rna_rep1
    rna_rep2
    rna_rep3
    pvalue
    experiment
  }
}
`);

export const CAPRA_DOUBLE_FUNCTIONAL_DATA_QUERY = gql(`
query capraFccDoubleQuery($accession: [String]!) {
  capraFccDoubleQuery(accession: $accession) {
    rdhs_p1
    rdhs_p2
    log2fc
    fdr
    dna_rep1
    rna_rep1
    rna_rep2
    rna_rep3
    pvalue
    experiment
  }
}
`);

export const CCRE_RDHS_QUERY = gql(`
query rdhs($rDHS: [String!],$assembly: String!) {
  cCREQuery(assembly: $assembly, rDHS: $rDHS) {
    accession
    rDHS
  }
}
`);
