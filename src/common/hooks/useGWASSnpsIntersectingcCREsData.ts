import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";

const GWAS_CCRE_QUERY = gql(`
 query getcCREsOverlappedbyGivenStudy($studyid: [String!]!) {
  getCcresforGivenGWASStudy(studyid: $studyid) {
    ccre
    ldblocksnpid
    rsquare
    studyid
    snpid    
  }
}
`);

export type UseGWASSnpsIntersectingcCREsParams = {
  studyid: string[];
};

export type UseGWASSnpsIntersectingcCREsReturn = {
  data:
    | {
        ccre: string;
        snpid: string;
        ldblocksnpid: string;        
        rsquare: string;
        studyid: string;
      }[]
    | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export const useGWASSnpsIntersectingcCREsData = ({
  studyid,
}: UseGWASSnpsIntersectingcCREsParams): UseGWASSnpsIntersectingcCREsReturn => {
  const {
    data: gwasstudySNPs,
    loading: gwasstudySNPsLoading,
    error,
  } = useQuery(GWAS_CCRE_QUERY, {
    variables: {
      studyid: studyid, //["Dastani_Z-22479202-Adiponectin_levels"]
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !studyid || studyid.length === 0,
  });


  return {
    data: gwasstudySNPs?.getCcresforGivenGWASStudy,
    loading: gwasstudySNPsLoading ,
    error: error ,
  };
};