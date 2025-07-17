import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "types/generated/gql";
import { GeneQuery } from "types/generated/graphql";
import { GenomicElementType, GenomicRange } from "types/globalTypes";

const GENE_Query = gql(`
  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {
    gene(chromosome: $chromosome, start: $start, end: $end, assembly: "GRCh38", version: 29, name: $name) {
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
  | { name: string | string[]; coordinates?: never; elementType?: GenomicElementType }
  | { coordinates: GenomicRange; name?: never; elementType?: GenomicElementType }

export type UseGeneDataReturn<T extends UseGeneDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { name: string[] })
  ? { data: GeneQuery["gene"] | undefined; loading: boolean; error: ApolloError }
  : { data: GeneQuery["gene"][0] | undefined; loading: boolean; error: ApolloError };

export const useGeneData = <T extends UseGeneDataParams>({name, coordinates, elementType}: T): UseGeneDataReturn<T> => {

  const { data, loading, error } = useQuery(
    GENE_Query,
    {
      variables: {
        chromosome: coordinates?.chromosome,
        start: coordinates?.start,
        end: coordinates?.end,
        name
      },
      skip: (elementType !== undefined) && elementType !== 'gene'
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