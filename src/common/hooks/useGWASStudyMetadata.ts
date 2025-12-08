import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { GetGwasAllStudiesMetadataQuery } from "common/types/generated/graphql";

const GWAS_ALL_STUDIES_METADATA_Query = gql(`
  query getGWASAllStudiesMetadata($layer_2_terms: [String],$studyid: [String], $limit: Int, $studyname_prefix: [String], $parent_terms: [String]){  
    getGWASStudiesMetadata(studyid: $studyid, layer_2_terms: $layer_2_terms, limit: $limit, parent_terms: $parent_terms, studyname_prefix: $studyname_prefix )  
    {        
        studyid
        author
        disease_trait
        has_enrichment_info
        population
        parent_terms
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

export type UseGWASStudyMetaDataParams = {
  studyid?: string[];
  parent_terms?: string[];
  layer_2_terms?: string[];
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
  layer_2_terms,
  entityType,
}: UseGWASStudyMetaDataParams): UseGWASStudyMetaDataReturn => {
  const { data, loading, error } = useQuery(GWAS_ALL_STUDIES_METADATA_Query, {
    variables: {
      studyid: studyid,
      parent_terms,
      layer_2_terms
    },
    skip: entityType !== undefined && entityType !== "gwas",
  });

  return {
    data: data?.getGWASStudiesMetadata.map((d)=> {
    return {
      ...d,      
      layer_2_terms: !d.layer_2_terms ? ["other"] : d.layer_2_terms

    }}),
    loading,
    error,
  } as UseGWASStudyMetaDataReturn;
};