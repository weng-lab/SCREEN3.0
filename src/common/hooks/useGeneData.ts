import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { GeneQuery } from "types/generated/graphql";
import { Assembly, EntityType, GenomicRange } from "types/globalTypes";

const GENE_Query = gql(`
  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String], $assembly: String!, $version: Int) {
    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version: $version, name: $name) {
      name
      id
      strand
      coordinates {
        chromosome
        end
        start
      }
    }
  }
`)

/**
 * Currently the backend does not support querying for genes in multiple regions,
 * which limits the input here to GenomicRange and not also GenomicRange[]
 */

export type UseGeneDataParams = 
  | { name: string | string[]; coordinates?: never; entityType?: EntityType; assembly?: Assembly }
  | { coordinates: GenomicRange; name?: never; entityType?: EntityType; assembly?: Assembly }

export type UseGeneDataReturn<T extends UseGeneDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { name: string[] })
  ? { data: GeneQuery["gene"] | undefined; loading: boolean; error: ApolloError }
  : { data: GeneQuery["gene"][0] | undefined; loading: boolean; error: ApolloError };

export const useGeneData = <T extends UseGeneDataParams>({name, coordinates, entityType, assembly}: T): UseGeneDataReturn<T> => {

  const { data, loading, error } = useQuery(
    GENE_Query,
    {
      variables: {
        chromosome: coordinates?.chromosome,
        start: coordinates?.start,
        end: coordinates?.end,
        assembly,
        version: assembly === "GRCh38" ? 29 : 25,
        name
      },
      skip: (entityType !== undefined) && entityType !== 'gene',
    }
  );

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof name === "object") ? data?.gene : data?.gene[0],
    loading,
    error,
  } as UseGeneDataReturn<T>
}