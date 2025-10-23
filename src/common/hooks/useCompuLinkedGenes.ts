import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";

import { ComputationalGeneLinksQuery } from "../types/generated/graphql";

export const ComputationalGeneLinks_Query = gql(`
  query ComputationalGeneLinks($accession: [String]!, $method: [String]){
    ComputationalGeneLinksQuery(accession: $accession, method: $method){
      genename
      accession
      geneid
      genetype
      method
      celltype
      score
      methodregion
      fileaccession
    }
  }
`);

export type useCompuLinkedGenesParams = {
  accessions: string[];
  method: string;
};

export type useCompuLinkedGenesReturn = {
  data: ComputationalGeneLinksQuery["ComputationalGeneLinksQuery"] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export const useCompuLinkedGenes = ({ accessions, method }: useCompuLinkedGenesParams): useCompuLinkedGenesReturn => {
  const {
    data: studyCompuLinkedGenes,
    loading: studyCompuLinkedGenesLoading,
    error: studyCompuLinkedGenesError,
  } = useQuery(ComputationalGeneLinks_Query, {
    variables: {
      //assembly: "grch38",
      accession: accessions,
      method: [method],
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !accessions || accessions.length === 0,
    errorPolicy: "all", // helps debug
  });

  return {
    data: studyCompuLinkedGenes ? studyCompuLinkedGenes.ComputationalGeneLinksQuery : undefined,
    loading: studyCompuLinkedGenesLoading,
    error: studyCompuLinkedGenesError,
  };
};
