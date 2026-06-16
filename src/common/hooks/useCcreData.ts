import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { Assembly, GenomicRange } from "common/types/globalTypes";

const USE_CCRE_DATA_QUERY = gql(`
  query useCcreData(
    $assembly: String!
    $accession: [String!]
    $coordinates: [GenomicRangeInput!]
  ) {
    cCREQuery(
      assembly: $assembly
      accession: $accession
      coordinates: $coordinates
    ) {
      accession
      group
      coordinates {
        chromosome
        end
        start
      }
    }
  }
`);

export type UseCcreDataParams =
  | {
      assembly: Assembly;
      accessions: string[];
      coordinates?: undefined;
      skip?: boolean;
    }
  | {
      assembly: Assembly;
      accessions?: undefined;
      coordinates: GenomicRange[];
      skip?: boolean;
    };

/**
 * Tightly scoped, returning only the most commonly used metadata
 */
export const useCcreData = ({ assembly, accessions, coordinates, skip }: UseCcreDataParams) => {
  const { data, loading, error } = useQuery(USE_CCRE_DATA_QUERY, {
    variables: { assembly, accession: accessions, coordinates },
    skip,
  });

  return {
    data: data?.cCREQuery,
    loading,
    error,
  };
};
