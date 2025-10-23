import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "types/generated/gql";
import { useMemo } from "react";
import { GeneQuery } from "types/generated/graphql";
import { Assembly, GenomicRange } from "types/globalTypes";

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
        transcripts {
      coordinates {
        chromosome
        end
        start
      }
      id
      name
      strand
    }
    }
  }
`)

/**
 * Currently the backend does not support querying for genes in multiple regions,
 * which limits the input here to GenomicRange and not also GenomicRange[]
 */

export type UseGeneDataParams = 
  | { name: string | string[]; coordinates?: never; entityType?: AnyEntityType; assembly: Assembly; skip?: boolean }
  | { coordinates: GenomicRange; name?: never; entityType?: AnyEntityType; assembly: Assembly; skip?: boolean }

export type UseGeneDataReturn<T extends UseGeneDataParams> =
  T extends ({ coordinates: GenomicRange | GenomicRange[] } | { name: string[] })
  ? { data: GeneQuery["gene"] | undefined; loading: boolean; error: ApolloError }
  : { data: GeneQuery["gene"][0] | undefined; loading: boolean; error: ApolloError };

export const useGeneData = <T extends UseGeneDataParams>({name, coordinates, entityType, assembly, skip}: T): UseGeneDataReturn<T> => {

  const shouldQueryBothVersions = assembly === "GRCh38" && !skip && (entityType === undefined || entityType === 'gene');

  const v29Query = useQuery(
    GENE_Query,
    {
      variables: {
        chromosome: coordinates?.chromosome,
        start: coordinates?.start,
        end: coordinates?.end,
        assembly,
        version: 29,
        name
      },
      skip: !shouldQueryBothVersions,
    }
  );

  const v40Query = useQuery(
    GENE_Query,
    {
      variables: {
        chromosome: coordinates?.chromosome,
        start: coordinates?.start,
        end: coordinates?.end,
        assembly,
        version: 40,
        name
      },
      skip: !shouldQueryBothVersions,
    }
  );

  // For mouse, just use v25
  const mouseQuery = useQuery(
    GENE_Query,
    {
      variables: {
        chromosome: coordinates?.chromosome,
        start: coordinates?.start,
        end: coordinates?.end,
        assembly,
        version: 25,
        name
      },
      skip: assembly !== "mm10" || skip || (entityType !== undefined && entityType !== 'gene'),
    }
  );

  // Combine and deduplicate results for human, keeping v40 when duplicates exist
  const processedData = useMemo(() => {
    if (assembly === "GRCh38") {
      if (v29Query.loading || v40Query.loading) return undefined;
      if (!v29Query.data?.gene && !v40Query.data?.gene) return undefined;

      // Create a map of gene IDs to their data, preferring v40
      const geneMap = new Map();
      
      // Add v29 genes first
      v29Query.data?.gene?.forEach(gene => {
        if (gene) geneMap.set(gene.id, gene);
      });
      
      // Override with v40 genes
      v40Query.data?.gene?.forEach(gene => {
        if (gene) geneMap.set(gene.id, gene);
      });

      // Convert back to array
      return Array.from(geneMap.values());
    } else {
      return mouseQuery.data?.gene;
    }
  }, [assembly, v29Query.data, v40Query.data, mouseQuery.data, v29Query.loading, v40Query.loading]);

  const isLoading = assembly === "GRCh38" 
    ? (v29Query.loading || v40Query.loading)
    : mouseQuery.loading;

  const error = assembly === "GRCh38"
    ? (v29Query.error || v40Query.error)
    : mouseQuery.error;

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: (coordinates || typeof name === "object") ? processedData : processedData?.[0],
    loading: isLoading,
    error,
  } as UseGeneDataReturn<T>
}