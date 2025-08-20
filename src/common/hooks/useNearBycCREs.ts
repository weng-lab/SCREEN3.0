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
export default function useNearbycCREs(geneid: string) {
  const { data, loading, error } = useQuery(NEAR_BY_CCRES_QUERY, {
    variables: { geneid: [geneid.split(".")[0]] },
    skip: !geneid
  });

  const {
    data: ccredata,
    loading: ccreloading,
    error: ccreerror,
  } = useQuery(CCRE_ICRE_QUERY, {
    variables: { assembly: "grch38", includeiCREs: true, accession: [...new Set(data?.closestGenetocCRE.map((l) => l.ccre))]  },
    skip: loading || !data || (data && data.closestGenetocCRE.length === 0 ),
  });

  const cCREDetails: { [key: string]: boolean } = {};
  if (ccredata && ccredata.cCREAutocompleteQuery.length > 0) {
    ccredata.cCREAutocompleteQuery.forEach((c) => {
      cCREDetails[c.accession] = c.isiCRE;
    });
  }
  const result: any = data && Object.values(
    data?.closestGenetocCRE.reduce((acc, obj) => ({ ...acc, [obj.ccre]: obj }), {})
    );

  return { data: result?.map(l=>{
    return {
      ...l,
      isiCRE: cCREDetails && cCREDetails[l.ccre]
      
    }
  }) as NearBycCREs[], loading, error };
}

export type NearBycCREs = {  
  isiCRE?: boolean;
  group?: string;
  stop?: number;
  start?: number;
  chromosome?: string;
  ccre?: string;
};

const NEAR_BY_CCRES_QUERY = gql(`
query getclosestGenetocCRE($geneid: [String],$ccre: [String]) {
  closestGenetocCRE(geneid: $geneid,ccre: $ccre) {
     gene {
      chromosome
      stop
      start
      name
      type
    }
    ccre
    chromosome
    stop
    start
  }
}
  `);
