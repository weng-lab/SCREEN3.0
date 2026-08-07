import { useQuery } from "@apollo/client/react";
import type { ErrorLike } from "@apollo/client";
import { useMemo } from "react";
import { gql } from "common/types/generated/gql";
import { GetAllGwasStudiesQuery } from "common/types/generated/graphql";

/**
 * Every study, for the GWAS landing page's category browse. Fetches the whole set — the layer 2
 * grouping and the search are both applied client side, see useCategorizedStudies. Metadata for a
 * single study on the entity pages is a separate, much smaller query, see useGWASStudy.
 */
const ALL_GWAS_STUDIES_Query = gql(`
  query getAllGWASStudies($parent_terms: [String]) {
    getGWASStudiesMetadata(parent_terms: $parent_terms) {
      studyid
      author
      disease_trait
      has_enrichment_info
      population
      parent_terms
      layer_2_terms
      total_ld_blocks
    }
  }
`);

export type GWASStudyListItem = GetAllGwasStudiesQuery["getGWASStudiesMetadata"][number];

export type UseAllGWASStudiesParams = {
  parent_terms?: string[];
};

export type UseAllGWASStudiesReturn = {
  data: GWASStudyListItem[] | undefined;
  loading: boolean;
  error: ErrorLike;
};

export const useAllGWASStudies = ({ parent_terms }: UseAllGWASStudiesParams): UseAllGWASStudiesReturn => {
  const { data, loading, error } = useQuery(ALL_GWAS_STUDIES_Query, {
    variables: {
      parent_terms,
    },
  });

  const transformedData = useMemo(
    () =>
      data?.getGWASStudiesMetadata.map((d) => ({
        ...d,
        layer_2_terms: !d.layer_2_terms ? ["other"] : d.layer_2_terms,
      })),
    [data]
  );

  return {
    data: transformedData,
    loading,
    error,
  };
};
