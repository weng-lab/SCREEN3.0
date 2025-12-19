"use client";
import { ApolloError, useQuery } from "@apollo/client";
import { AnyEntityType } from "common/entityTabsConfig";
import { gql } from "common/types/generated/gql";
import { useMemo } from "react";
import { ChromRange, GeneQuery } from "common/types/generated/graphql";
import { Assembly, GenomicRange } from "common/types/globalTypes";

const GENE_Query = gql(`
  query Gene($assembly: String!, $range: [ChromRange], 
    $name: [String]
    $version: Int) {
    gene(assembly: $assembly, range: $range, name: $name, version: $version) {
      name
      id
      strand
      gene_type
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
`);

export type UseGeneDataParams =
  | { name: string | string[]; coordinates?: never; entityType?: AnyEntityType; assembly: Assembly; skip?: boolean }
  | {
      coordinates: GenomicRange | GenomicRange[];
      name?: never;
      entityType?: AnyEntityType;
      assembly: Assembly;
      skip?: boolean;
    };

export type UseGeneDataReturn<T extends UseGeneDataParams> = T extends
  | { coordinates: GenomicRange | GenomicRange[] }
  | { name: string[] }
  ? { data: GeneQuery["gene"] | undefined; loading: boolean; error: ApolloError }
  : { data: GeneQuery["gene"][0] | undefined; loading: boolean; error: ApolloError };

const toBedRange = (c: GenomicRange): ChromRange => ({
  chromosome: c.chromosome,
  start: c.start,
  stop: c.end, //different name
});

const convertCoordsToQueryFormat = (coordinates: GenomicRange | GenomicRange[]): ChromRange | ChromRange[] => {
  if (!coordinates) return undefined
  if (Array.isArray(coordinates)) {
    return coordinates.map(toBedRange);
  } else return toBedRange(coordinates);
};

export const useGeneData = <T extends UseGeneDataParams>({
  name,
  coordinates,
  entityType,
  assembly,
  skip,
}: T): UseGeneDataReturn<T> => {
  const shouldQueryBothVersions = assembly === "GRCh38" && !skip && (entityType === undefined || entityType === "gene");

  const v29Query = useQuery(GENE_Query, {
    variables: {
      range: convertCoordsToQueryFormat(coordinates),
      assembly,
      version: 29,
      name,
    },
    skip: !shouldQueryBothVersions,
  });

  const v40Query = useQuery(GENE_Query, {
    variables: {
      range: convertCoordsToQueryFormat(coordinates),
      assembly,
      version: 40,
      name,
    },
    skip: !shouldQueryBothVersions,
  });

  const mouseQuery = useQuery(GENE_Query, {
    variables: {
      range: convertCoordsToQueryFormat(coordinates),
      assembly,
      version: 25,
      name,
    },
    skip:
      Array.isArray(coordinates) || assembly !== "mm10" || skip || (entityType !== undefined && entityType !== "gene"),
  });

  // Combine and deduplicate results for human, keeping v40 when duplicates exist
  const processedData = useMemo(() => {
    if (assembly === "GRCh38") {
      if (v29Query.loading || v40Query.loading) return undefined;
      if (!v29Query.data?.gene && !v40Query.data?.gene) return undefined;

      // Create a map of gene IDs to their data, preferring v40
      const geneMap = new Map();

      // Add v29 genes first
      v29Query.data?.gene?.forEach((gene) => {
        if (gene) geneMap.set(gene.id.split(".")[0], gene);
      });

      // Override with v40 genes
      v40Query.data?.gene?.forEach((gene) => {
        if (gene) geneMap.set(gene.id.split(".")[0], gene);
      });

      // Convert back to array
      return Array.from(geneMap.values());
    } else {
      return mouseQuery.data?.gene;
    }
  }, [assembly, v29Query.loading, v29Query.data?.gene, v40Query.loading, v40Query.data?.gene, mouseQuery.data?.gene]);

  const loading = assembly === "GRCh38" ? v29Query.loading || v40Query.loading : mouseQuery.loading;
  const error = assembly === "GRCh38" ? v29Query.error || v40Query.error : mouseQuery.error;

  return {
    /**
     * return either whole array or just first item depending on input
     */
    data: coordinates || typeof name === "object" ? processedData : processedData?.[0],
    loading,
    error,
  } as UseGeneDataReturn<T>;
};
