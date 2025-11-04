import { parseGenomicRangeString } from "common/utility";
import type { AnyOpenEntity } from "./types";

/**
 * Helper function to determine if two entities are the same. Really only needed due to region entity issues of
 * ':' and '%3A' mismatch, as well as the same region being searchable in multiple assemblies.
 * @param entity1
 * @param entity2
 * @returns boolean
 */
export const isSameEntity = (entity1: AnyOpenEntity, entity2: AnyOpenEntity) => {
  if (!(entity1.assembly === entity2.assembly)) return false;
  if (entity1.entityType === "region" && entity2.entityType === "region") {
    // need to check the parsed genomic region to handle url encoding of ':' and '%3A'
    return (
      JSON.stringify(parseGenomicRangeString(entity1.entityID)) ===
      JSON.stringify(parseGenomicRangeString(entity2.entityID))
    );
  } else return entity1.entityID === entity2.entityID && entity1.entityType === entity2.entityType;
};