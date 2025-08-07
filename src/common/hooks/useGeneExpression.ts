import { ApolloError, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "types/generated/gql";
import { GeneexpressionQuery } from "types/generated/graphql";
import { Assembly } from "types/globalTypes";

const GET_GENE_EXPRESSION = gql(`
query geneexpression($assembly: String!, $gene_id: [String]) {
  gene_dataset(processed_assembly: $assembly) {
    biosample
    tissue
  	cell_compartment
    biosample_type
  	assay_term_name
    accession  
    gene_quantification_files(assembly: $assembly) {
      accession
      biorep
      quantifications(gene_id_prefix: $gene_id) {
        tpm
        file_accession
      }
    }
  }
}
 `)

export type UseGeneDataParams = {
  id: string
  assembly: Assembly
}

export type UseGeneExpressionReturn = {
  data: GeneexpressionQuery["gene_dataset"] | undefined;
  loading: boolean;
  error: ApolloError
}

export const useGeneExpression = ({ id, assembly }: UseGeneDataParams): UseGeneExpressionReturn => {

  const { data, loading, error } = useQuery(
    GET_GENE_EXPRESSION,
    {
      variables: {
        gene_id: id.split('.')[0],
        assembly: assembly,
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
      gene_dataset: data.gene_dataset.map((x) => {
        return {
          ...x,
          biosample: x.biosample.replaceAll('\"', ''),
          biosampleid: x.biosample_type.replaceAll('\"', '')
        }
      })
    }
  }, [data])

  return {
    data: correctedData?.gene_dataset,
    loading,
    error,
  }
}