import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { Assembly } from "common/types/globalTypes";

const GET_CCRES_WITH_GENE_IN_CLOSEST_3 = gql(`
  query GetCcresWithGeneInClosest3($assembly: String!, $gene: String!) {
    getClosest3GenesTocCREQuery(assembly: $assembly, gene_name: [$gene]) {
      accession
    }
  }
`)

export const useCcresWithGeneInClosest3 = ({gene, assembly, skip}: {gene: string, assembly: Assembly, skip?: boolean}) => {
  const { data, loading, error } = useQuery(GET_CCRES_WITH_GENE_IN_CLOSEST_3, { variables: { gene, assembly }, skip });

  return {
    data: data?.getClosest3GenesTocCREQuery.map(item => item.accession),
    loading,
    error
  }
}

/**
 * @todo
 * So we most of the data fetching hooks setup now
 * - Implement useCcreZScoresAcrossBiosamples and have it own classification logic, then simplify BiosampleActivity
 * - Use new hooks on DistanceLinkedCcres - replace CCRES_BY_CLOSEST_GENE_QUERY. 
 * ^ This allows us to add the 3gene method to the table for mouse I think
 */