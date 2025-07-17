import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { SnpQuery } from "types/generated/graphql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";

const SNP_Query = gql(`
  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {
    snpQuery(assembly: "GRCh38", snpids: $snpids, coordinates: $coordinates) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
  }
`)

type UseSnpDataParams = 
  | { rsID: string | string[]; coordinates?: never; elementType?: GenomicElementType }
  | { coordinates: GenomicRange | GenomicRange[]; rsID?: never; elementType?: GenomicElementType }

export type UseSnpDataReturn<T extends UseSnpDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { rsID: string[] })
  ? { data: SnpQuery["snpQuery"] | undefined; loading: boolean; error: ApolloError }
  : { data: SnpQuery["snpQuery"][0] | undefined; loading: boolean; error: ApolloError };

export const useSnpData = <T extends UseSnpDataParams>({ rsID, coordinates, elementType }: T): UseSnpDataReturn<T> => {
  const { data, loading, error } = useQuery(
    SNP_Query,
    {
      variables: {
        coordinates,
        snpids: rsID
      },
      skip: (elementType !== undefined) && elementType !== 'variant'
    },
  );

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof rsID === "object") ? data?.snpQuery : data?.snpQuery[0],
    loading,
    error,
  } as UseSnpDataReturn<T>
}