import { useQuery } from "@apollo/client/react";
import type { ErrorLike } from "@apollo/client";
import { gql } from "common/types/generated/gql";
import { SnpQuery } from "common/types/generated/graphql";
import { Assembly, GenomicRange } from "common/types/globalTypes";

const SNP_Query = gql(`
  query Snp($snpids: [String], $coordinates: [GenomicRangeInput], $assembly: String!) {
    snpQuery(assembly: $assembly, snpids: $snpids, coordinates: $coordinates) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`);

type UseSnpDataParams =
  | { rsID: string | string[]; coordinates?: never; assembly: Assembly; skip?: boolean }
  | {
      coordinates: GenomicRange | GenomicRange[];
      rsID?: never;
      assembly: Assembly;
      skip?: boolean;
    };

export type UseSnpDataReturn<T extends UseSnpDataParams> = T extends
  | { coordinates: GenomicRange | GenomicRange[] }
  | { rsID: string[] }
  ? { data: SnpQuery["snpQuery"] | undefined; loading: boolean; error: ErrorLike }
  : { data: SnpQuery["snpQuery"][0] | undefined; loading: boolean; error: ErrorLike };

export const useSnpData = <T extends UseSnpDataParams>({
  rsID,
  coordinates,
  assembly,
  skip,
}: T): UseSnpDataReturn<T> => {
  const { data, loading, error } = useQuery(SNP_Query, {
    variables: {
      coordinates,
      snpids: rsID,
      assembly: assembly,
    },
    skip: skip || assembly !== "GRCh38",
  });

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: coordinates || typeof rsID === "object" ? data?.snpQuery : data?.snpQuery[0],
    loading,
    error,
  } as UseSnpDataReturn<T>;
};
