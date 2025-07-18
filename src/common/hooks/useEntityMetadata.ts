import { EntityType, GenomicRange } from "types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";
import { ApolloError } from "@apollo/client";
import { parseGenomicRangeString } from "common/utility";
import { useCcreData, UseCcreDataReturn } from "./useCcreData";

type useEntityMetadataParams<T extends EntityType> = {
  entityType: T,
  entityID: string
}

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = { data: {__typename?: "Region", coordinates: GenomicRange}; loading: boolean; error: ApolloError }

export type useEntityMetadataReturn<T extends EntityType> = T extends "gene"
  ? UseGeneDataReturn<{ name: string }>
  : T extends "ccre"
  ? UseCcreDataReturn<{ accession: string }>
  : T extends "variant"
  ? UseSnpDataReturn<{ rsID: string }>
  : UseGenomicRangeReturn;

export const useEntityMetadata = <T extends EntityType>({ entityType, entityID }: useEntityMetadataParams<T>): useEntityMetadataReturn<T> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({name: entityID, entityType});
  const icreMetadata = useCcreData({accession: entityID, entityType});
  const snpMetadata = useSnpData({rsID: entityID, entityType});
  //example to use useSnpFrequencies, returns ref,alt alleles and population frequencies 
  //const SnpFrequencies= useSnpFrequencies(elementID);
  
  switch (entityType) {
    case "gene":
      return geneMetadata as useEntityMetadataReturn<T>;
    case "ccre":
      return icreMetadata as useEntityMetadataReturn<T>;
    case "variant":
      return snpMetadata as useEntityMetadataReturn<T>;
    case "region":
      try {
        const region = parseGenomicRangeString(entityID)
        return {data: {coordinates: region}, loading: false, error: undefined} as useEntityMetadataReturn<T>
      } catch (error) {
        return {data: undefined, loading: false, error} as useEntityMetadataReturn<T>
      }
  }
}