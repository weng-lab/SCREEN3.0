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

/**
 * Currently the backend does not support querying for genes in multiple regions,
 * which limits the input here to GenomicRange and not also GenomicRange[]
 */

export type UseGWASStudyMetaDataParams = { studyid?: string[]; parent_terms? : string[]; studyname_prefix?: string[]; limit?: number; entityType?: AnyEntityType };

export type UseGWASStudyMetaDataReturn<T extends UseGWASStudyMetaDataParams> = {
  data: GetGwasAllStudiesMetadataQuery['getGWASStudiesMetadata'] | undefined;
  loading: boolean;
  error: ApolloError;
};

export const useGWASStudyMetaData = <T extends UseGWASStudyMetaDataParams>({
  studyid,
  parent_terms,
  entityType,
}: T): UseGWASStudyMetaDataReturn<T> => {
  const { data, loading, error } = useQuery(GWAS_ALL_STUDIES_METADATA_Query, {
    variables: {
      studyid: studyid
    },
    skip: entityType !== undefined && entityType !== "gwas",
  });

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: data?.getGWASStudiesMetadata,
    loading,
    error,
  } as UseGWASStudyMetaDataReturn<T>;
};