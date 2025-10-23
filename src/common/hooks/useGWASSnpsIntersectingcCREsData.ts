import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "common/types/generated/gql";

export const BED_INTERSECT = gql(`
    query bedIntersectCCRE ($inp: [cCRE]!, $assembly: String!, $maxOutputLength: Int) {
      intersection (
        userCcres: $inp,
        assembly: $assembly,
        maxOutputLength: $maxOutputLength
      )
    }
  `);

const GWAS_SNP_QUERY = gql(`
  query getSNPsforgivengwasStudy($study: [String!]!) {
    getSNPsforGWASStudies(study: $study) {
      snpid
      ldblock
      rsquare
      chromosome
      stop
      start
      ldblocksnpid
      __typename
    }
  }`);

export type UseGWASSnpsIntersectingcCREsParams = {
  study: string[];
};

export type UseGWASSnpsIntersectingcCREsReturn = {
  data:
    | {
        accession: string;
        snpid: string;
        ldblocksnpid: string;
        ldblock: string;
        rsquare: string;
      }[]
    | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export const useGWASSnpsIntersectingcCREsData = ({
  study,
}: UseGWASSnpsIntersectingcCREsParams): UseGWASSnpsIntersectingcCREsReturn => {
  const {
    data: gwasstudySNPs,
    loading: gwasstudySNPsLoading,
    error,
  } = useQuery(GWAS_SNP_QUERY, {
    variables: {
      study: study, //["Dastani_Z-22479202-Adiponectin_levels"]
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !study || study.length === 0,
  });

  const snpsRegions =
    gwasstudySNPs &&
    gwasstudySNPs.getSNPsforGWASStudies.map((g) => {
      return [
        g.chromosome.toString(),
        g.start.toString(),
        g.stop.toString(),
        g.snpid.toString(),
        g.rsquare.toString(),
        g.ldblocksnpid.toString(),
        g.ldblock.toString(),
      ];
    });

  const {
    data: cCREIntersections,
    loading: cCREIntersectionsLoading,
    error: cCREIntersectionsError,
  } = useQuery(BED_INTERSECT, {
    variables: {
      inp: snpsRegions,
      assembly: "grch38",
      maxOutputLength: 10000,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip:
      gwasstudySNPsLoading ||
      (gwasstudySNPs && gwasstudySNPs.getSNPsforGWASStudies.length === 0) ||
      !snpsRegions ||
      snpsRegions.length === 0,
  });

  const cCREsIntersectionData: {
    accession: string;
    snpid: string;
    ldblocksnpid: string;
    ldblock: string;
    rsquare: string;
  }[] =
    cCREIntersections && cCREIntersections.intersection.length > 0
      ? cCREIntersections.intersection.map((c) => {
          return {
            accession: c[4],
            snpid: c[9],
            ldblocksnpid: c[11],
            ldblock: c[12],
            rsquare: c[10],
          };
        })
      : undefined;

  return {
    data: cCREsIntersectionData,
    loading: gwasstudySNPsLoading || cCREIntersectionsLoading,
    error: error || cCREIntersectionsError,
  };
};
