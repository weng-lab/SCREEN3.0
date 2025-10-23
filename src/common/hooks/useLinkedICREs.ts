import { gql, useQuery } from "@apollo/client";

const CCRE_ICRE_QUERY = gql(`query cCREAutocompleteQuery(
  $accession: [String!]
  $assembly: String!
  $includeiCREs: Boolean  
) {
  cCREAutocompleteQuery(
    includeiCREs: $includeiCREs
    assembly: $assembly    
    accession: $accession
  ) {    
    accession    
    isiCRE    
  }
}`);
export default function useLinkedICREs(geneid: string) {
  const { data, loading, error } = useQuery(LINKED_ICRE_QUERY, {
    variables: { geneid: [geneid.split(".")[0]], assembly: "grch38" },
    skip: !geneid,
  });

  /**
   * @todo why is this necessary, can this use the other data fetching hook, or can that useCcreDetails or useIcreData call this, and this can call those
   * This is only used to specify is a linked cCRE is an iCRE. It feels like there shoud be a "useCcreData" which returns this information.
   */
  const {
    data: ccredata,
    loading: ccreloading,
    error: ccreerror,
  } = useQuery(CCRE_ICRE_QUERY, {
    variables: {
      assembly: "grch38",
      includeiCREs: true,
      accession: [...new Set(data?.linkedcCREs.map((l) => l.accession))],
    },
    skip: loading || !data || (data && data.linkedcCREs.length === 0),
  });

  const cCREDetails: { [key: string]: boolean } = {};
  if (ccredata && ccredata.cCREAutocompleteQuery.length > 0) {
    ccredata.cCREAutocompleteQuery.forEach((c) => {
      cCREDetails[c.accession] = c.isiCRE;
    });
  }
  return {
    data: data?.linkedcCREs.map((l) => {
      return {
        ...l,
        isiCRE: cCREDetails && cCREDetails[l.accession],
      };
    }) as LinkedICREInfo[],
    loading,
    error,
  };
}

/**
 * @todo this type should extend the type exposed by auto generated type instead of being entire redefined.
 */
export type LinkedICREInfo = {
  accession?: string;
  p_val?: number;
  isiCRE?: boolean;
  gene?: string;
  geneid?: string;
  genetype?: string;
  method?: string;
  grnaid?: string;
  effectsize?: number;
  assay?: "RNAPII-ChIAPET" | "CTCF-ChIAPET" | "Intact-HiC" | "CRISPRi-FlowFISH";
  celltype?: string;
  experiment_accession?: string;
  tissue?: string;
  variantid?: string;
  source?: string;
  slope?: number;
  score?: number;
  displayname?: string;
  id?: string;
};

const LINKED_ICRE_QUERY = gql(`
query LinkedcCREs($geneid: [String!]!, $assembly: String!) {
  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {
    accession
    p_val
    gene
    geneid
    genetype
    method
    grnaid
    effectsize
    assay
    celltype
    experiment_accession
    tissue
    variantid
    source
    slope
    score
    displayname
    __typename
  }
}
  `);
