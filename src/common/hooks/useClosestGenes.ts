import { gql } from "common/types/generated/gql";
import { useQuery } from "@apollo/client/react";


export type ClosestGenes = {
  distance: number;
  stop?: number;
  start?: number;
  chromosome?: string;
  type?: string;
  name: string;
};

export const CLOSEST_GENE_QUERY = gql(`
  query tempNearestGenes(
    $assembly: String!
    $accession: String!
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      accession: [$accession]
    ) {
      nearestgenes {
        distance
        gene
      }
    }
  }
`);

export const GENES_DATA_QUERY = gql(`   
query geneDataQuery($assembly: String!,$name: [String], $version: Int) {
    gene(assembly: $assembly, name: $name, version: $version) {
      name
      id
        gene_type
      coordinates {
        start
        chromosome
        end
      }
    }
  }  
 
`);

export default function useClosestGenes(accession: string, assembly: string) {
  // @TODO replace with whatever query ends up having the middle anchored distance to TSS
  const {
    data: closestGeneData,
    loading: closestGeneLoading,
    error: closestGeneError,
  } = useQuery(CLOSEST_GENE_QUERY, {
    variables: {
      accession,
      assembly: assembly,
    },
  });

  const {
    data: geneData,
    loading: geneLoading,
    error: geneError,
  } = useQuery(GENES_DATA_QUERY, {
    variables: {
      name: closestGeneData && closestGeneData.getmaxZScoresQuery[0]?.nearestgenes.map((item: any) => item.gene),
      version: assembly == "GRCh38" ? 40 : 25,
      assembly: assembly,
    },
    skip: closestGeneLoading || !closestGeneData || (closestGeneData && closestGeneData.getmaxZScoresQuery.length === 0),
  });

  const closestGenes =
    closestGeneData &&
    closestGeneData.getmaxZScoresQuery.length &&
    closestGeneData.getmaxZScoresQuery[0].nearestgenes.map((item: any) => {
      let g;
      if (geneData && !geneError && !geneLoading) {
        g = geneData.gene.find((g) => g.name === item.gene);
      }

      return {
        name: item.gene,
        distance: item.distance,
        chromosome: g && g.coordinates.chromosome,
        start: g && g.coordinates.start,
        stop: g && g.coordinates.end,
        type:
          g && g.gene_type === "lncRNA"
            ? g.gene_type
            : g &&
              g.gene_type
                .replaceAll("_", " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
      };
    });

  return { data: closestGenes as ClosestGenes[], loading: closestGeneLoading, error: closestGeneError };
}
