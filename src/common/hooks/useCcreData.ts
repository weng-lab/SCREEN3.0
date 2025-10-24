import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { CCrescreenSearchQueryQuery } from "common/types/generated/graphql";
import { Assembly, GenomicRange } from "common/types/globalTypes";

type CcreWithIsicre = CCrescreenSearchQueryQuery["cCRESCREENSearch"][number] & {
  isicre: boolean;
};
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

const CCRE_QUERY = gql(`
  query cCRESCREENSearchQuery(
    $accessions: [String!]
    $assembly: String!
    $cellType: String
    $coordinates: [GenomicRangeInput]
    $nearbygeneslimit: Int
  ) {
    cCRESCREENSearch(
      assembly: $assembly
      accessions: $accessions
      coordinates: $coordinates
      cellType: $cellType
      nearbygeneslimit: $nearbygeneslimit
    ) {
      chrom
      start
      len
      pct
      info {
        accession
      }
      ctcf_zscore
      dnase_zscore
      enhancer_zscore
      promoter_zscore
      atac_zscore
      nearestgenes {
        gene        
        distance
      }
      ctspecific {
        ct
        dnase_zscore
        h3k4me3_zscore
        h3k27ac_zscore
        ctcf_zscore
        atac_zscore
      }  
    }
  }
`);

type UseCcreDataParams =
  | {
      assembly: Assembly;
      accession?: string | string[];
      coordinates?: never;
      entityType?: AnyEntityType;
      nearbygeneslimit?: number;
      cellType?: string;
    }
  | {
      assembly: Assembly;
      coordinates: GenomicRange | GenomicRange[];
      accession?: never;
      entityType?: AnyEntityType;
      nearbygeneslimit?: number;
      cellType?: string;
    };

export type UseCcreDataReturn<T extends UseCcreDataParams> = T extends
  | { coordinates: GenomicRange | GenomicRange[] }
  | { accession: string[] }
  ? {
      data: (CCrescreenSearchQueryQuery["cCRESCREENSearch"][number] & { isicre?: boolean })[] | undefined;
      loading: boolean;
      error: ApolloError;
    }
  : {
      data: (CCrescreenSearchQueryQuery["cCRESCREENSearch"][0] & { isicre?: boolean }) | undefined;
      loading: boolean;
      error: ApolloError;
    };

export const useCcreData = <T extends UseCcreDataParams>({
  accession,
  coordinates,
  entityType,
  assembly,
  nearbygeneslimit,
  cellType,
}: T): UseCcreDataReturn<T> => {
  const { data, loading, error } = useQuery(CCRE_QUERY, {
    variables: {
      coordinates: coordinates ? (Array.isArray(coordinates) ? coordinates : [coordinates]) : coordinates,
      accessions: accession ? (Array.isArray(accession) ? accession : [accession]) : undefined,
      assembly: assembly,
      nearbygeneslimit: nearbygeneslimit || 3,
      cellType: cellType,
    },
    skip:
      (entityType !== undefined && entityType !== "ccre") ||
      ((!accession || (Array.isArray(accession) && accession.length === 0)) &&
        (!coordinates || (Array.isArray(coordinates) && coordinates.length === 0))),
  });

  const {
    data: ccredata,
    loading: ccreloading,
    error: ccreerror,
  } = useQuery(CCRE_ICRE_QUERY, {
    variables: {
      assembly: "grch38",
      includeiCREs: true,
      accession: data?.cCRESCREENSearch.map((d) => d.info.accession),
    },
    skip: loading || !data || (data && data.cCRESCREENSearch.length === 0) || assembly !== "GRCh38",
  });
  const cCREDetails: { [key: string]: boolean } = {};
  if (ccredata && ccredata.cCREAutocompleteQuery.length > 0) {
    ccredata.cCREAutocompleteQuery.forEach((c) => {
      cCREDetails[c.accession] = c.isiCRE;
    });
  }
  return {
    /**
     * return either whole array or just first item depending on input
     */
    data:
      coordinates || typeof accession === "object"
        ? (data?.cCRESCREENSearch.map((item) => ({
            ...item,
            isicre: cCREDetails && cCREDetails[item.info.accession],
          })) as CcreWithIsicre[])
        : data?.cCRESCREENSearch[0]
          ? ({
              ...data.cCRESCREENSearch[0],
              isicre: cCREDetails && cCREDetails[data.cCRESCREENSearch[0].info.accession],
            } as CcreWithIsicre)
          : undefined,
    loading,
    error,
  } as UseCcreDataReturn<T>;
};
