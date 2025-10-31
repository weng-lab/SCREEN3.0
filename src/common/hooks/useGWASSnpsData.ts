import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";
import { GetSnPsIdentifiedbyGivenStudyQuery } from "common/types/generated/graphql";

const GWAS_SNP_QUERY = gql(`
  query getSNPsIdentifiedbyGivenStudy($studyid: [String!]!) {
  getSNPsforGivenGWASStudy(studyid: $studyid) {
    snpid
    ldblock
    studyid
    ldblocksnpid
    rsquare
    stop
    start
    chromosome
  }
}
`);

export type UseGWASSnpsParams = {
  studyid: string[];
};

export type UseGWASSnpsReturn = {
  data: GetSnPsIdentifiedbyGivenStudyQuery['getSNPsforGivenGWASStudy'] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASSnpsData = ({ studyid }: UseGWASSnpsParams): UseGWASSnpsReturn => {
  const { data, loading, error } = useQuery(GWAS_SNP_QUERY, {
    variables: {
      studyid,
    },
    skip: !studyid || studyid.length === 0,
  });

  return {
    data: data?.getSNPsforGivenGWASStudy,
    loading,
    error,
  };
};