import { gql, useQuery } from "@apollo/client";

export type ClosestGenes = {
  distance: number;
  stop?: number;
  start?: number;
  chromosome?: string;
  type?: string;
  name: string;
};

export const CLOSEST_GENE_QUERY = gql(`
   query ccreSearchQuery_2(
    $assembly: String!    
    $accessions: [String!]
  ) {
    cCRESCREENSearch(
      assembly: $assembly
      accessions: $accessions      
      nearbygeneslimit: 3
    ) {
      
      nearestgenes {
        gene        
        distance
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

export default function useClosestgenes(accession: string, assembly: string) {
  const {
    data: closestGeneData,
    loading: closestGeneLoading,
    error: closestGeneError,
  } = useQuery(CLOSEST_GENE_QUERY, {
    variables: {
      accessions: [accession],
      assembly: assembly,
    },
  });

  const {
    data: geneData,
    loading: geneLoading,
    error: geneError,
  } = useQuery(GENES_DATA_QUERY, {
    variables: {
      name: closestGeneData && closestGeneData.cCRESCREENSearch[0].nearestgenes.map((item: any) => item.gene),
      version: 40,
      assembly: assembly,
    },
    skip: closestGeneLoading || !closestGeneData || (closestGeneData && closestGeneData.cCRESCREENSearch.length === 0),
  });

  const closestGenes =
    closestGeneData &&
    closestGeneData.cCRESCREENSearch[0].nearestgenes.map((item: any) => {
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
