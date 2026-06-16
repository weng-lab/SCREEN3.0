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