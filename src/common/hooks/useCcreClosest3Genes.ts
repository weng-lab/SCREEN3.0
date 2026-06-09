import { useQuery } from "@apollo/client/react";
import { gql } from "common/types/generated";
import { Assembly } from "common/types/globalTypes";

const GET_CLOSEST_3_GENES = gql(`
  query GetClosest3GenesTocCRE($assembly: String!, $accession: String!) {
    getClosest3GenesTocCREQuery(assembly: $assembly, accession: [$accession]) {
      gene_name
      distance
      midccre_distance
      midccre_gene_name
    }
  }
`)

export const useCcreNearest3Genes = ({accession, assembly, skip}: {accession: string, assembly: Assembly, skip?: boolean}) => {
  const { data, loading, error } = useQuery(GET_CLOSEST_3_GENES, { variables: { accession, assembly }, skip });
  
  return {
    data: data?.getClosest3GenesTocCREQuery,
    loading,
    error
  }
}