import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetGwasStudiesQuery } from "common/types/generated/graphql";

const GWAS_STUDY_Query = gql(`
  query getGWASStudies($study: [String]){  
    getAllGwasStudies(study: $study)  
    {        
        study
        studyname
        totalldblocks
        author
        pubmedid
    }
}
`);

export type UseGWASStudyDataParams = { study: string[]; entityType?: AnyEntityType };

export type UseGWASStudyDataReturn = {
  data: GetGwasStudiesQuery["getAllGwasStudies"][0] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASStudyData = <T extends UseGWASStudyDataParams>({
  study,
  entityType,
}: T): UseGWASStudyDataReturn => {
  const { data, loading, error } = useQuery(GWAS_STUDY_Query, {
    variables: {
      study: study,
    },
    skip: entityType !== undefined && entityType !== "gwas",
  });

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: data?.getAllGwasStudies[0],
    loading,
    error,
  } as UseGWASStudyDataReturn;
};
