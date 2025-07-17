import { GenomicElementType, GenomicRange } from "types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useIcreData, UseIcreDataReturn } from "./useIcreData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";
import { ApolloError } from "@apollo/client";
import { parseGenomicRangeString } from "common/utility";

type useElementMetadataParams<T extends GenomicElementType> = {
  elementType: T,
  elementID: string
}

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = { data: {__typename?: "Region", coordinates: GenomicRange}; loading: boolean; error: ApolloError }

export type useElementMetadataReturn<T extends GenomicElementType> = T extends "gene"
  ? UseGeneDataReturn<{ name: string }>
  : T extends "icre"
  ? UseIcreDataReturn<{ accession: string }>
  : T extends "variant"
  ? UseSnpDataReturn<{ rsID: string }>
  : UseGenomicRangeReturn;

export const useElementMetadata = <T extends GenomicElementType>({ elementType, elementID }: useElementMetadataParams<T>): useElementMetadataReturn<T> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({name: elementID, elementType});
  const icreMetadata = useIcreData({accession: elementID, elementType});
  const snpMetadata = useSnpData({rsID: elementID, elementType});
  //example to use useSnpFrequencies, returns ref,alt alleles and population frequencies 
  //const SnpFrequencies= useSnpFrequencies(elementID);
  
  switch (elementType) {
    case "gene":
      return geneMetadata as useElementMetadataReturn<T>;
    case "icre":
      return icreMetadata as useElementMetadataReturn<T>;
    case "variant":
      return snpMetadata as useElementMetadataReturn<T>;
    case "region":
      try {
        const region = parseGenomicRangeString(elementID)
        return {data: {coordinates: region}, loading: false, error: undefined} as useElementMetadataReturn<T>
      } catch (error) {
        return {data: undefined, loading: false, error} as useElementMetadataReturn<T>
      }
  }
}