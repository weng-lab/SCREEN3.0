import { useQuery } from "@apollo/client/react";
import type { ErrorLike } from "@apollo/client";
import { gql } from "common/types/generated/gql";
import { GetGwasStudyQuery } from "common/types/generated/graphql";

/**
 * Metadata for a single study, used by the GWAS entity pages. The study list shown on the GWAS
 * landing page is a separate query, see useAllGWASStudies.
 */
const GWAS_STUDY_Query = gql(`
  query getGWASStudy($studyid: [String]) {
    getGWASStudiesMetadata(studyid: $studyid) {
      studyid
      author
      disease_trait
      total_ld_blocks
      ld_blocks_overlapping_ccres
      overlapping_ccres
      platform
      initial_sample_size
      replication_sample_size
    }
  }
`);

export type GWASStudy = GetGwasStudyQuery["getGWASStudiesMetadata"][number];

export type UseGWASStudyParams = {
  studyid: string;
  skip?: boolean;
};

export type UseGWASStudyReturn = {
  data: GWASStudy | undefined;
  loading: boolean;
  error: ErrorLike;
};

export const useGWASStudy = ({ studyid, skip }: UseGWASStudyParams): UseGWASStudyReturn => {
  const { data, loading, error } = useQuery(GWAS_STUDY_Query, {
    variables: {
      studyid: [studyid],
    },
    skip,
  });

  return {
    data: data?.getGWASStudiesMetadata[0],
    loading,
    error,
  };
};
