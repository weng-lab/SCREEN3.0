import { Assembly, EntityType, GenomicRange } from "types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";
import { ApolloError } from "@apollo/client";
import { parseGenomicRangeString } from "common/utility";
import { useCcreData, UseCcreDataReturn } from "./useCcreData";
import { useGWASStudyData, UseGWASStudyDataReturn } from "./useGWASStudyData";

type useEntityMetadataParams<T extends EntityType> = {
  assembly: Assembly,
  entityType: T,
  entityID: string
}

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = { data: {__typename?: "Region", coordinates: GenomicRange}; loading: boolean; error: ApolloError }
//type UseGWASReturn = { data:  {__typename?: "GWAS", study_name: string, value: string, author: string, pubmedid: string}; loading: boolean; error: ApolloError }

export type useEntityMetadataReturn<T extends EntityType> = T extends "gene"
  ? UseGeneDataReturn<{ name: string, assembly: Assembly }>
  : T extends "ccre"
  ? UseCcreDataReturn<{ accession: string, assembly: Assembly  }>
  : T extends "variant"
  ? UseSnpDataReturn<{ rsID: string, assembly: Assembly  }>
  : T extends "gwas" ? UseGWASStudyDataReturn<{ study: string[]  }> : UseGenomicRangeReturn;

export const useEntityMetadata = <T extends EntityType>({ assembly, entityType, entityID }: useEntityMetadataParams<T>): useEntityMetadataReturn<T> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({name: entityID, entityType, assembly});
  const ccreMetadata = useCcreData({accession: entityID, entityType, assembly});
  const snpMetadata = useSnpData({rsID: entityID, entityType, assembly: "GRCh38"});
  const gwasStudyMetadata = useGWASStudyData({study: [entityID], entityType})
  //example to use useSnpFrequencies, returns ref,alt alleles and population frequencies 
  //const SnpFrequencies= useSnpFrequencies(elementID);

  console.log("gwasStudyMetadata",gwasStudyMetadata)
  
  switch (entityType) {
    case "gene":
      return geneMetadata as useEntityMetadataReturn<T>;
    case "ccre":
      return ccreMetadata as useEntityMetadataReturn<T>;
    case "variant":
      return snpMetadata as useEntityMetadataReturn<T>;
    case "region":
      try {
        const region = parseGenomicRangeString(entityID)
        return {data: {coordinates: region}, loading: false, error: undefined} as useEntityMetadataReturn<T>
      } catch (error) {
        return {data: undefined, loading: false, error} as useEntityMetadataReturn<T>
      }
    case "gwas": 
      return gwasStudyMetadata as useEntityMetadataReturn<T>;
    //const studyval= "Dastani_Z-22479202-Adiponectin_levels"
    /*const g = entityID.split("-")
    const study_name = g[g.length-1].replaceAll("_"," ");
    const pubmedid = g[g.length-2].replaceAll("_"," ");
    const author = g.slice(0, g.length - 2).join("-").replaceAll("_"," ");
      try {        
        return {data: {__typename: "GWAS",study_name, author, value: entityID, pubmedid}, loading: false, error: undefined} as useEntityMetadataReturn<T>
      } catch (error) {
        return {data: undefined, loading: false, error} as useEntityMetadataReturn<T>
      }*/
  }
}