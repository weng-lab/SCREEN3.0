import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetGwasAllStudiesMetadataQuery } from "common/types/generated/graphql";

const GWAS_ALL_STUDIES_METADATA_Query = gql(`
  query getGWASAllStudiesMetadata($studyid: [String], $limit: Int, $studyname_prefix: [String], $parent_terms: [String]){  
    getGWASStudiesMetadata(studyid: $studyid, limit: $limit, parent_terms: $parent_terms, studyname_prefix: $studyname_prefix )  
    {        
        studyid
        author
        disease_trait
        has_enrichment_info
        population
        parent_terms
    }
}
`);

export type UseGWASStudyMetaDataParams = {
  studyid?: string[];
  parent_terms?: string[];
  studyname_prefix?: string[];
  limit?: number;
  entityType?: AnyEntityType;
};

export type UseGWASStudyMetaDataReturn = {
  data: GetGwasAllStudiesMetadataQuery['getGWASStudiesMetadata'] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASStudyMetaData = ({
  studyid,
  parent_terms,
  entityType,
}: UseGWASStudyMetaDataParams): UseGWASStudyMetaDataReturn => {
  const { data, loading, error } = useQuery(GWAS_ALL_STUDIES_METADATA_Query, {
    variables: {
      studyid: studyid
    },
    skip: entityType !== undefined && entityType !== "gwas",
  });

  return {
    data: data?.getGWASStudiesMetadata,
    loading,
    error,
  } as UseGWASStudyMetaDataReturn;
};