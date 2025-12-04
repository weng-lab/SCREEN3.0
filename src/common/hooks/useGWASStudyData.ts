import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetGwasStudyMetadataQuery } from "common/types/generated/graphql";

const GWAS_STUDY_METADATA_Query = gql(`
  query getGWASStudyMetadata($studyid: [String], $limit: Int, $studyname_prefix: [String], $parent_terms: [String]){  
    getGWASStudiesMetadata(studyid: $studyid, limit: $limit, parent_terms: $parent_terms, studyname_prefix: $studyname_prefix )  
    {        
        studyid
        author
        disease_trait
        has_enrichment_info
        population
        parent_terms        
        total_ld_blocks
        ld_blocks_overlapping_ccres
        overlapping_ccres
        journal
        link
        study 
        initial_sample_size
        replication_sample_size         
        platform       
        layer_2_terms
        total_ld_blocks
        genotyping_technology
    }
}
`);

export type UseGWASStudyDataParams = {
  studyid?: string[];
  parent_terms?: string[];
  studyname_prefix?: string[];
  limit?: number;
  entityType?: AnyEntityType;
};

export type UseGWASStudyDataReturn = {
  data: GetGwasStudyMetadataQuery["getGWASStudiesMetadata"][0] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASStudyData = ({
  studyid,
  parent_terms,
  entityType,
}: UseGWASStudyDataParams): UseGWASStudyDataReturn => {
  const { data, loading, error } = useQuery(GWAS_STUDY_METADATA_Query, {
    variables: {
      studyid: studyid
    },
    skip: entityType !== undefined && entityType !== "gwas",
    fetchPolicy: "cache-and-network",
  });

  return {
    data: data?.getGWASStudiesMetadata[0],
    loading,
    error,
  } as UseGWASStudyDataReturn;
};
