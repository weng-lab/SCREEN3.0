import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { GetSnPsforgivengwasStudyQuery } from "types/generated/graphql";

const GWAS_SNP_QUERY = gql(`
  query getSNPsforgivengwasStudy($study: [String!]!) {
    getSNPsforGWASStudies(study: $study) {
      snpid
      ldblock
      rsquare
      chromosome
      stop
      start
      ldblocksnpid
      __typename
    }
  }`);

export type UseGWASSnpsParams = {
  study: string[];
};

export type UseGWASSnpsReturn = {
  data: GetSnPsforgivengwasStudyQuery["getSNPsforGWASStudies"] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASSnpsData = ({ study }: UseGWASSnpsParams): UseGWASSnpsReturn => {
  const { data, loading, error } = useQuery(GWAS_SNP_QUERY, {
    variables: {
      study,
    },
    skip: !study || study.length === 0,
  });

  return {
    data: data?.getSNPsforGWASStudies,
    loading,
    error,
  };
};
