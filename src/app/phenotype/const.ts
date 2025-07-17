import { gql } from "@apollo/client";

// In the slider, the "value" is used to place marks equally on track. The scale function below is used to pull out the true value that we want
export const pValMarks = [
  {
    value: 0,
    scaledValue: 0.0001,
    label: 0.0001,
  },
  {
    value: 1,
    scaledValue: 0.001,
    label: 0.001,
  },
  {
    value: 2,
    scaledValue: 0.01,
    label: 0.01,
  },
  {
    value: 3,
    scaledValue: 0.05,
    label: 0.05,
  },
  {
    value: 4,
    scaledValue: 1,
    label: 1,
  },
];

export const scale = (value: number) => {
  return pValMarks.find((x) => x.value === value).scaledValue;
};

/**
 * Queries
 */
export const ICRE_STUDIES = gql`
  {
    iCRELdscStudiesQuery {
      disease
      author
      value
      category
      study_source
    }
  }
`;

export const iCRE_LDSC_QUERY = gql`
  query getLDSCValues($study: [String]!) {
    iCRELdscQuery(study: $study) {
      study
      expvalue
      source
      celltype
      lineage
      biosample
      biosampleid
      biosampleorder
      stimulation

      study_source
      disease
      category

      snps
      h2
      h2_std_error
      enrichment
      enrichment_std_error
      enrichment_p
      coefficient
      coefficient_std_error
      coefficient_zscore
    }
  }
`;

export const iCRE_LDSC_BASELINE_QUERY = gql`
  query getLDSCBaselineValues($study: [String]!) {
    iCRELdscBaselineQuery(study: $study) {
      celltype
      snps
      h2
      h2_std_error
      study
      enrichment
      enrichment_std_error
      enrichment_p
      coefficient
      coefficient_std_error
      coefficient_zscore
    }
  }
`;
