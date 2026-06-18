import { gql } from "common/types/generated/gql";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { capitalizeFirstLetter } from "common/utility";

export type ClosestGenes = {
  distance: number;
  stop?: number;
  start?: number;
  chromosome?: string;
  type?: string;
  name: string;
};

export const CLOSEST_3_GENE_QUERY = gql(`
  query tempNearestGenes(
    $assembly: String!
    $accession: String!
  ) {
    getmaxZScoresQuery(
      assembly: $assembly
      accession: [$accession]
    ) {
      midccre_nearestgenes {
        distance
        gene
      }
      nearestgenes {
        distance
        gene
      }
    }
  }
`);

export const GET_GENE_TYPE_AND_COORDS = gql(`   
  query geneDataQuery($assembly: String!, $genes: [String], $version: Int) {
    gene(assembly: $assembly, name: $genes, version: $version) {
      name
      gene_type
      coordinates {
        start
        chromosome
        end
      }
    }
  }
`);

const formatGeneType = (type: string) => {
  if (type === "lncRNA") return type;
  return type
    .replaceAll("_", " ")
    .split(" ")
    .map(capitalizeFirstLetter)
    .join(" ");
};

export function useCcreClosest3Genes(accession: string, assembly: string) {

  const {
    data: dataClosest3,
    loading: loadingClosest3,
    error: errorClosest3,
  } = useQuery(CLOSEST_3_GENE_QUERY, {
    variables: {
      accession,
      assembly: assembly,
    },
  });

  const uniqueGenes = dataClosest3?.getmaxZScoresQuery.length
    ? [
        ...new Set([
          ...dataClosest3.getmaxZScoresQuery[0].nearestgenes.map((x) => x.gene),
          ...dataClosest3.getmaxZScoresQuery[0].midccre_nearestgenes.map((x) => x.gene),
        ]),
      ]
    : null;

  const {
    data: dataGenes,
    loading: loadingGenes,
    error: errorGenes,
  } = useQuery(GET_GENE_TYPE_AND_COORDS, {
    variables: {
      genes: uniqueGenes,
      version: assembly == "GRCh38" ? 40 : 25,
      assembly: assembly,
    },
    skip: !dataClosest3 || (dataClosest3 && dataClosest3.getmaxZScoresQuery.length === 0),
  });

  const geneMetadata = dataGenes
    ? Object.fromEntries(
        dataGenes?.gene.map((item) => [
          item.name,
          { type: formatGeneType(item.gene_type), coordinates: item.coordinates },
        ])
      )
    : {};

  const returnData = useMemo(() => {
    if (!dataClosest3) return undefined
    return (
      {
        middleAnchor: dataClosest3.getmaxZScoresQuery[0].midccre_nearestgenes.map(gene => ({...gene, ...geneMetadata[gene.gene]})),
        edgeAnchor: dataClosest3.getmaxZScoresQuery[0].nearestgenes.map(gene => ({...gene, ...geneMetadata[gene.gene]})),
      }
    )
  }, [dataClosest3, dataGenes])

  return {
    data: returnData,
    loading: loadingClosest3,
    error: errorClosest3,
    loadingMetadata: loadingGenes,
    errorMetadata: errorGenes,
  };
}
