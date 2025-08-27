import { Assembly, EntityType, GenomicRange } from "types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";
import { ApolloError } from "@apollo/client";
import { parseGenomicRangeString } from "common/utility";
import { useCcreData, UseCcreDataReturn } from "./useCcreData";

type useEntityMetadataParams<A extends Assembly, E extends EntityType<A>> = {
  assembly: A;
  entityType: E;
  entityID: string;
};

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = { data: {__typename?: "Region", coordinates: GenomicRange}; loading: boolean; error: ApolloError }


/**
 * This will need to be changed if this file persists and we add entities that are assembly specific
 */
export type useEntityMetadataReturn<A extends Assembly, E extends EntityType<A>> = E extends "gene"
  ? UseGeneDataReturn<{ name: string, assembly: A }>
  : E extends "ccre"
  ? UseCcreDataReturn<{ accession: string, assembly: A  }>
  : E extends "variant"
  ? UseSnpDataReturn<{ rsID: string, assembly: A  }>
  : UseGenomicRangeReturn;

export const useEntityMetadata = <A extends Assembly, E extends EntityType<A>>({ assembly, entityType, entityID }: useEntityMetadataParams<A, E>): useEntityMetadataReturn<A, E> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({name: entityID, entityType, assembly});
  const ccreMetadata = useCcreData({accession: entityID, entityType, assembly});
  const snpMetadata = useSnpData({rsID: entityID, entityType, assembly: "GRCh38"});
  //example to use useSnpFrequencies, returns ref,alt alleles and population frequencies 
  //const SnpFrequencies= useSnpFrequencies(elementID);
  
  switch (entityType) {
    case "gene":
      return geneMetadata as useEntityMetadataReturn<A, E>;
    case "ccre":
      return ccreMetadata as useEntityMetadataReturn<A, E>;
    case "variant":
      return snpMetadata as useEntityMetadataReturn<A, E>;
    case "region":
      try {
        const region = parseGenomicRangeString(entityID)
        return {data: {coordinates: region}, loading: false, error: undefined} as useEntityMetadataReturn<A, E>
      } catch (error) {
        return {data: undefined, loading: false, error} as useEntityMetadataReturn<A, E>
      }
  }
}