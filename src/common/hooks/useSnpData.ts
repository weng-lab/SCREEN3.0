import { ApolloError, useQuery } from "@apollo/client";
import { EntityType } from "common/EntityDetails/entityTabsConfig";
import { gql } from "types/generated/gql";
import { SnpQuery } from "types/generated/graphql";
import { Assembly, GenomicRange } from "types/globalTypes";

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
`)

type UseSnpDataParams<A extends Assembly> = 
  | { rsID: string | string[]; coordinates?: never; entityType?: EntityType<A>; assembly: A }
  | { coordinates: GenomicRange | GenomicRange[]; rsID?: never; entityType?: EntityType<A>; assembly: A }

export type UseSnpDataReturn<A extends Assembly, T extends UseSnpDataParams<A>> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { rsID: string[] })
  ? { data: SnpQuery["snpQuery"] | undefined; loading: boolean; error: ApolloError }
  : { data: SnpQuery["snpQuery"][0] | undefined; loading: boolean; error: ApolloError };

export const useSnpData = <A extends Assembly, T extends UseSnpDataParams<A>>({ rsID, coordinates, entityType, assembly }: T): UseSnpDataReturn<A, T> => {
  const { data, loading, error } = useQuery(
    SNP_Query,
    {
      variables: {
        coordinates,
        snpids: rsID,
        assembly: assembly
      },
      skip: (entityType !== undefined) && entityType !== 'variant' || (assembly!=="GRCh38")
    },
  );

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof rsID === "object") ? data?.snpQuery : data?.snpQuery[0],
    loading,
    error,
  } as UseSnpDataReturn<A, T>
}