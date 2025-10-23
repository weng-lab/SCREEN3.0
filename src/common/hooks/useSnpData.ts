import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
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
  | { rsID: string | string[]; coordinates?: never; entityType?: AnyEntityType; assembly: Assembly }
  | { coordinates: GenomicRange | GenomicRange[]; rsID?: never; entityType?: AnyEntityType; assembly: Assembly };

export type UseSnpDataReturn<T extends UseSnpDataParams> = T extends
  | { coordinates: GenomicRange | GenomicRange[] }
  | { rsID: string[] }
  ? { data: SnpQuery["snpQuery"] | undefined; loading: boolean; error: ApolloError }
  : { data: SnpQuery["snpQuery"][0] | undefined; loading: boolean; error: ApolloError };

export const useSnpData = <T extends UseSnpDataParams>({
  rsID,
  coordinates,
  entityType,
  assembly,
}: T): UseSnpDataReturn<T> => {
  const { data, loading, error } = useQuery(SNP_Query, {
    variables: {
      coordinates,
      snpids: rsID,
      assembly: assembly,
    },
    skip: (entityType !== undefined && entityType !== "variant") || assembly !== "GRCh38",
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
