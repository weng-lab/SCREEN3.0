import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { Assembly } from "common/types/globalTypes";
import { useMemo } from "react";

const GET_NEAREST_GENE = gql(`
  query getNearestGenes(
    $assembly: String!
    $accessions: [String!]
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      accession: $accessions
      nearbygeneslimit: 1
    ) {
      accession
      midccre_nearestgenes {
        distance
        gene
      }
      nearestgenes {
        distance
        gene
      }
    }
  }
`);

/**
 * Distance uses middle of cCRE as anchor, or 0 if overlap
 */
export const useCcreClosestTSS = ({
  accessions,
  assembly,
  skip,
}: {
  accessions: string[];
  assembly: Assembly;
  skip?: boolean;
}) => {
  const { data, loading, error } = useQuery(GET_NEAREST_GENE, { variables: { accessions, assembly }, skip });

  const returnData = useMemo(() => {
    if (!data?.getmaxZScoresQuery) return undefined;

    return Object.fromEntries(
      data.getmaxZScoresQuery.map((item) => [
        item.accession,
        {
          middleAnchor: { gene: item.midccre_nearestgenes[0].gene, distance: item.midccre_nearestgenes[0].distance },
          edgeAnchor: { gene: item.nearestgenes[0].gene, distance: item.nearestgenes[0].distance },
        },
      ])
    );
  }, [data]);

  return {
    data: returnData,
    loading,
    error,
  };
};
