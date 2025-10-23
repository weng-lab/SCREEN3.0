import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "types/generated/gql";
import { GetGwasStudiesQuery } from "types/generated/graphql";


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

/**
 * Currently the backend does not support querying for genes in multiple regions,
 * which limits the input here to GenomicRange and not also GenomicRange[]
 */

export type UseGWASStudyDataParams = { study: string[]; entityType?: AnyEntityType };

export type UseGWASStudyDataReturn<T extends UseGWASStudyDataParams> = {
  data: GetGwasStudiesQuery["getAllGwasStudies"][0] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASStudyData = <T extends UseGWASStudyDataParams>({
  study,
  entityType,
}: T): UseGWASStudyDataReturn<T> => {
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
  } as UseGWASStudyDataReturn<T>;
};
