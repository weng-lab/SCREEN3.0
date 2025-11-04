import { isValidAssembly } from "common/types/globalTypes";
import type { AnyOpenEntity, CandidateOpenEntity } from "./types";
import { isValidEntityType, isValidRouteForEntity } from "common/entityTabsConfig";

export const isValidOpenEntity = (e: CandidateOpenEntity): e is AnyOpenEntity => {
  return (
    isValidAssembly(e.assembly) &&
    isValidEntityType(e.assembly, e.entityType) &&
    isValidRouteForEntity(e.assembly, e.entityType, e.tab)
  );
};
