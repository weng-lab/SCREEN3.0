import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { IcresZscoresQuery } from "types/generated/graphql";

const GET_ICRE_ACTIVITY = gql(`
  query IcresZscores($accession: [String]!) {
    immuneiCREsUmapQuery(accession: $accession) {
      source
      study
      link
      lineage
      celltype
      biosample
      biosampleid
      celltype_stim
      stimulation
      celltype_stim_order
      biosample_order
      name
      expid
      assay
      value
      umap_1
      umap_2
      umap_atac_1
      umap_atac_2
      umap_dnase_1
      umap_dnase_2
      accession
    }
  }
`)

export type UseIcreActivityParams = {
  accession: string | string[],
}

export type UseIcreActivityReturn = {
  data: IcresZscoresQuery["immuneiCREsUmapQuery"] | undefined;
  loading: boolean;
  error: ApolloError
}

export const useIcreActivity = ({ accession }: UseIcreActivityParams): UseIcreActivityReturn => {

  const { data, loading, error } = useQuery(
    GET_ICRE_ACTIVITY,
    {
      variables: {
        accession
      },
      skip: !accession || accession.length === 0
    },
  );

  return {
    data: data?.immuneiCREsUmapQuery,
    loading,
    error,
  }
}