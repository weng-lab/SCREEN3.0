import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { CCrescreenSearchQueryQuery } from "types/generated/graphql";
import { Assembly, EntityType, GenomicRange } from "types/globalTypes";

const CCRE_QUERY = gql(`
  query cCRESCREENSearchQuery(
    $accessions: [String!]
    $assembly: String!
    $coordinates: [GenomicRangeInput]
    $nearbygeneslimit: Int
  ) {
    cCRESCREENSearch(
      assembly: $assembly
      accessions: $accessions
      coordinates: $coordinates
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
    }
  }
`);

type UseCcreDataParams = 
  | { assembly: string, accession: string | string[]; coordinates?: never; entityType?: EntityType, nearbygeneslimit?: number }
  | { assembly: string, coordinates: GenomicRange | GenomicRange[]; accession?: never; entityType?: EntityType, nearbygeneslimit?: number }

export type UseCcreDataReturn<T extends UseCcreDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { accession: string[] })
  ? { data: CCrescreenSearchQueryQuery["cCRESCREENSearch"] | undefined; loading: boolean; error: ApolloError }
  : { data: CCrescreenSearchQueryQuery["cCRESCREENSearch"][0] | undefined; loading: boolean; error: ApolloError };

export const useCcreData = <T extends UseCcreDataParams>({accession, coordinates, entityType, assembly}: T): UseCcreDataReturn<T> => {
  const { data, loading, error } = useQuery(CCRE_QUERY, {
    variables: { 
      coordinates,
      accessions: accession,
      assembly: assembly.toLowerCase()
     },
    skip: (entityType !== undefined) && entityType !== 'ccre'
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