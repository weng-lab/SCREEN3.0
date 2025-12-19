import { Assembly, GenomicRange } from "common/types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "./useGeneData";
import { useSnpData, UseSnpDataReturn } from "./useSnpData";
import { ApolloError } from "@apollo/client";
import { parseGenomicRangeString } from "common/utility";
import { useCcreData, UseCcreDataReturn } from "./useCcreData";
import { AnyEntityType } from "common/entityTabsConfig";
import { useGWASStudyData, UseGWASStudyDataReturn } from "./useGWASStudyData";

type useEntityMetadataParams<T extends AnyEntityType> = {
  assembly: Assembly;
  entityType: T;
  entityID: string;
};

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = {
  data: { __typename?: "Region"; coordinates: GenomicRange };
  loading: boolean;
  error: ApolloError;
};

type UseBedReturn = {
  data: { __typename?: "Bed" };
  loading: boolean;
  error: ApolloError;
};

/**
 * This will need to be changed if this file persists and we add entities that are assembly specific
 */
export type useEntityMetadataReturn<T extends AnyEntityType> = T extends "gene"
  ? UseGeneDataReturn<{ name: string; assembly: Assembly }>
  : T extends "ccre"
    ? UseCcreDataReturn<{ accession: string; assembly: Assembly }>
    : T extends "variant"
      ? UseSnpDataReturn<{ rsID: string; assembly: Assembly }>
      : T extends "gwas"
        ? UseGWASStudyDataReturn
        : T extends "bed"
          ? UseBedReturn
          : UseGenomicRangeReturn;

export const useEntityMetadata = <T extends AnyEntityType>({
  assembly,
  entityType,
  entityID,
}: useEntityMetadataParams<T>): useEntityMetadataReturn<T> => {
  /**
   * elementType is being passed to these hooks to prevent data from being fetched unless
   * it actually should be fetched. Need to call all hooks to follow rules of hooks:
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({ name: entityID, entityType, assembly });
  const ccreMetadata = useCcreData({ accession: entityID, entityType, assembly });
  const snpMetadata = useSnpData({ rsID: entityID, entityType, assembly: "GRCh38" });
  const gwasStudyMetadata = useGWASStudyData({ studyid: [entityID], entityType });
  //example to use useSnpFrequencies, returns ref,alt alleles and population frequencies
  //const SnpFrequencies= useSnpFrequencies(elementID);

  switch (entityType) {
    case "gene":
      return geneMetadata as useEntityMetadataReturn<T>;
    case "ccre":
      return ccreMetadata as useEntityMetadataReturn<T>;
    case "variant":
      return snpMetadata as useEntityMetadataReturn<T>;
    case "region":
      try {
        const region = parseGenomicRangeString(entityID);
        return { data: { coordinates: region }, loading: false, error: undefined } as useEntityMetadataReturn<T>;
      } catch (error) {
        return { data: undefined, loading: false, error } as useEntityMetadataReturn<T>;
      }
    case "gwas":
      return gwasStudyMetadata as useEntityMetadataReturn<T>;
    case "bed":
      return { data: { __typename: "Bed" }, loading: false, error: undefined } as useEntityMetadataReturn<T>;
  }
};
