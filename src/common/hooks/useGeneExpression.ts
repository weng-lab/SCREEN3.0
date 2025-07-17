import { ApolloError, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "types/generated/gql";
import { GeneExpressionQuery } from "types/generated/graphql";

const GET_GENE_EXPRESSION = gql(`
  query GeneExpression($gene_id: String!) {
    immuneRnaUmapQuery(gene_id: $gene_id) {
      umap_1    
      umap_2
      celltype
      study
      source
      link
      lineage
      biosample
      biosampleid    
      expid
      name    
      value
      stimulation
    }
  }
`)

export type UseGeneDataParams = {
  id: string
}

export type UseGeneExpressionReturn = {
  data: GeneExpressionQuery["immuneRnaUmapQuery"] | undefined;
  loading: boolean;
  error: ApolloError
}

export const useGeneExpression = ({ id }: UseGeneDataParams): UseGeneExpressionReturn => {

  const { data, loading, error } = useQuery(
    GET_GENE_EXPRESSION,
    {
      variables: {
        gene_id: id.split('.')[0]
      },
      skip: !id
    },
  );

  /**
   * Need to correct the data, since encode samples sometimes have a ' \" ' before and after the true value
   */
  const correctedData = useMemo(() => {
    if (!data) return data
    return {
      ...data,
      immuneRnaUmapQuery: data.immuneRnaUmapQuery.map((x) => {
        return {
          ...x,
          biosample: x.biosample.replaceAll('\"', ''),
          biosampleid: x.biosampleid.replaceAll('\"', '')
        }
      })
    }
  }, [data])

  return {
    data: correctedData?.immuneRnaUmapQuery,
    loading,
    error,
  }
}