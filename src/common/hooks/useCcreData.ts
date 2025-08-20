import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { CCrescreenSearchQueryQuery } from "types/generated/graphql";
import { Assembly, EntityType, GenomicRange } from "types/globalTypes";

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
  | { assembly: Assembly, accession?: string | string[]; coordinates?: never; entityType?: EntityType, nearbygeneslimit?: number, cellType?: string }
  | { assembly: Assembly, coordinates: GenomicRange | GenomicRange[]; accession?: never; entityType?: EntityType, nearbygeneslimit?: number, cellType?: string }

export type UseCcreDataReturn<T extends UseCcreDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { accession: string[] })
  ? { data: CCrescreenSearchQueryQuery["cCRESCREENSearch"] | undefined; loading: boolean; error: ApolloError }
  : { data: CCrescreenSearchQueryQuery["cCRESCREENSearch"][0] | undefined; loading: boolean; error: ApolloError };

export const useCcreData = <T extends UseCcreDataParams>({accession, coordinates, entityType, assembly, nearbygeneslimit, cellType}: T): UseCcreDataReturn<T> => {
  
  const { data, loading, error } = useQuery(CCRE_QUERY, {
    variables: { 
      coordinates: coordinates ? Array.isArray(coordinates) ? coordinates: [coordinates]: coordinates,
      accessions: accession ? Array.isArray(accession) ? accession: [accession] : undefined,
      assembly: assembly,
      nearbygeneslimit: nearbygeneslimit || 3,
      cellType: cellType
     },
    skip: ((entityType !== undefined) && entityType !== 'ccre') ||
    (
      (!accession || (Array.isArray(accession) && accession.length === 0)) &&
      (!coordinates || (Array.isArray(coordinates) && coordinates.length === 0))
    )
  });

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof accession === "object") ? data?.cCRESCREENSearch : data?.cCRESCREENSearch[0],
    loading,
    error,
  } as UseCcreDataReturn<T>
}