import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";

import { ComputationalcCreLinksQuery } from "../types/generated/graphql";

export const ComputationalcCREsLinks_Query = gql(`
 query ComputationalcCRELinks($geneid: [String]!, $method: [String]){
  ComputationalCcreLinksQuery(geneid: $geneid, method: $method) {
    genename
    accession
    geneid
    genetype
    method
    celltype
    score
    methodregion
    fileaccession
    accession
  }
}

`);

export type useCompuLinkedcCREsParams = {
  geneid: string[];
  method: string;
};

export type useCompuLinkedcCREsReturn = {
  data: ComputationalcCreLinksQuery["ComputationalCcreLinksQuery"] | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export const useCompuLinkedcCREs = ({ geneid, method }: useCompuLinkedcCREsParams): useCompuLinkedcCREsReturn => {
  const {
    data: dataCompuLinkedcCREs,
    loading: dataCompuLinkedcCREsLoading,
    error: dataCompuLinkedcCREsError,
  } = useQuery(ComputationalcCREsLinks_Query, {
    variables: {
      //assembly: "grch38",
      geneid: geneid,
      method: [method],
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !geneid || geneid.length === 0,
    errorPolicy: "all", // helps debug
  });

  return {
    data: dataCompuLinkedcCREs ? dataCompuLinkedcCREs.ComputationalCcreLinksQuery : undefined,
    loading: dataCompuLinkedcCREsLoading,
    error: dataCompuLinkedcCREsError,
  };
};
