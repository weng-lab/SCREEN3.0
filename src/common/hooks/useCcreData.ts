import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { GetcCreDetailsQuery } from "types/generated/graphql";
import { EntityType, GenomicRange } from "types/globalTypes";

const CCRE_QUERY = gql(`
  query getcCREDetails(
    $accessions: [String!]
    $coordinates: [GenomicRangeInput!]
  ) {
    cCREQuery(
      assembly: "grch38"
      accession: $accessions
      coordinates: $coordinates
    ) {
      group
      accession
      coordinates {
        start
        chromosome
        end
      }
    }
  }
`);

type UseCcreDataParams = 
  | { accession: string | string[]; coordinates?: never; entityType?: EntityType }
  | { coordinates: GenomicRange | GenomicRange[]; accession?: never; entityType?: EntityType }

export type UseCcreDataReturn<T extends UseCcreDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { accession: string[] })
  ? { data: GetcCreDetailsQuery["cCREQuery"] | undefined; loading: boolean; error: ApolloError }
  : { data: GetcCreDetailsQuery["cCREQuery"][0] | undefined; loading: boolean; error: ApolloError };

export const useCcreData = <T extends UseCcreDataParams>({accession, coordinates, entityType}: T): UseCcreDataReturn<T> => {
  const { data, loading, error } = useQuery(CCRE_QUERY, {
    variables: { 
      coordinates,
      accessions: accession,
     },
    skip: (entityType !== undefined) && entityType !== 'ccre'
  });

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof accession === "object") ? data?.cCREQuery : data?.cCREQuery[0],
    loading,
    error,
  } as UseCcreDataReturn<T>
}

