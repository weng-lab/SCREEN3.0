import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";

const CCRE_BIOSAMPLE_QUERY = gql(`
  query GetcCreBiosampleMetadataQuery($assembly: String!) {
    ccREBiosampleQuery(assembly: $assembly) {
      biosamples {
        name
        ontology
        lifeStage      
        sampleType
        displayname
        __typename
      }
      __typename
    }
  }`);

const GWAS_ENRICHMENT_QUERY = gql(`
  query getGWASBiosampleEnrichmentDataforGivenStudy($studyid: [String]) {
  getGWASBiosampleEnrichmentQuery(studyid: $studyid) {
    studyid
    fc
    accession
    fdr
    pvalue
    celltype
  }
}
`);

export type GWASEnrichment = {
  celltype: string;
  accession: string;
  fc: number;
  fdr: number;
  pvalue: number;
  ontology?: string;
  displayname?: string;
};

export type UseGWASEnrichmentParams = {
  study: string;
};

export type UseGWASEnrichmentReturn = {
  data: GWASEnrichment[] | undefined;
  loading: boolean;
  error: ApolloError;
};
const minFDRval: number = 1e-300;
const FCaugmentation: number = 0.000001;

export const useGWASEnrichmentData = ({ study }: UseGWASEnrichmentParams): UseGWASEnrichmentReturn => {
  const {
    data: enrichmentData,
    loading: enrichmentLoading,
    error: enrichmentError,
  } = useQuery(GWAS_ENRICHMENT_QUERY, {
    variables: {
      studyid: [study], //"Dastani_Z-22479202-Adiponectin_levels"
    },
    skip: !study || (study && study.length === 0),
  });
  const {
    data: biosampleData,
    loading: biosampleLoading,
    error: biosampleError,
  } = useQuery(CCRE_BIOSAMPLE_QUERY, {
    variables: { assembly: "grch38" },
  });

  const loading = enrichmentLoading || biosampleLoading;
  const error = enrichmentError || biosampleError;

  const isReady = !biosampleLoading && !enrichmentLoading && biosampleData && enrichmentData;

  const data: GWASEnrichment[] | undefined = isReady
    ? enrichmentData.getGWASBiosampleEnrichmentQuery.map((item) => {
        const matchedBiosample = biosampleData.ccREBiosampleQuery.biosamples.find((b) => b.name === item.celltype);
        return {
          ...item,
          // fc is already log2 transformed
          fc: item.fc,
          pvalue: item.pvalue === 0 ? minFDRval : item.pvalue,
          fdr: item.fdr === 0 ? minFDRval : item.fdr,
          ontology: matchedBiosample?.ontology,
          displayname: matchedBiosample?.displayname,
        };
      })
    : undefined;

  return {
    data,
    loading,
    error,
  };
};
