import type { ErrorLike } from "@apollo/client";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { useGeneData, UseGeneDataReturn } from "common/hooks/data/gene/useGeneData";
import { useSnpData, UseSnpDataReturn } from "common/hooks/data/variant/useSnpData";
import { parseGenomicRangeString } from "common/utility";
import { useCcre } from "common/hooks/data/ccre/useCcre";
import { AnyEntityType } from "common/entityTabsConfig";
import { useGWASStudyData, UseGWASStudyDataReturn } from "common/hooks/data/gwas/useGWASStudyData";

type useEntityMetadataParams<T extends AnyEntityType> = {
  assembly: Assembly;
  entityType: T;
  entityID: string;
};

//faking a return type of the same form as the others to make it easy
type UseGenomicRangeReturn = {
  data: { __typename?: "Region"; coordinates: GenomicRange };
  loading: boolean;
  error: ErrorLike;
};

type UseBedReturn = {
  data: { __typename?: "Bed" };
  loading: boolean;
  error: ErrorLike;
};

/**
 * This will need to be changed if this file persists and we add entities that are assembly specific
 */
export type useEntityMetadataReturn<T extends AnyEntityType> = T extends "gene"
  ? UseGeneDataReturn<{ name: string; assembly: Assembly }>
  : T extends "ccre"
    ? ReturnType<typeof useCcre>
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
   * Every metadata hook is called to follow the rules of hooks, but each is skipped unless its
   * entityType matches so only the relevant query actually fires.
   * See https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level
   */
  const geneMetadata = useGeneData({ name: entityID, assembly, skip: entityType !== "gene" });
  const ccreMetadata = useCcre({ accession: entityID, assembly, skip: entityType !== "ccre" });
  const snpMetadata = useSnpData({ rsID: entityID, assembly: "GRCh38", skip: entityType !== "variant" });
  const gwasStudyMetadata = useGWASStudyData({ studyid: [entityID], skip: entityType !== "gwas" });

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
