import type { Assembly } from "common/types/globalTypes";
import type { EntityRoute, EntityType, TabConfig } from "./types";
import { entityTabsConfig, validEntityTypes } from "./entityTabsConfig";

export const isValidEntityType = <A extends Assembly>(assembly: A, entityType: string): entityType is EntityType<A> => {
  return (validEntityTypes[assembly] as readonly string[]).includes(entityType);
};

export const isValidRouteForEntity = <A extends Assembly>(
  assembly: A,
  entityType: EntityType<A>,
  route: string
): route is A extends "GRCh38"
  ? EntityRoute<"GRCh38", EntityType<"GRCh38">>
  : EntityRoute<"mm10", EntityType<"mm10">> => {
  return entityTabsConfig[assembly][entityType].some((x: TabConfig) => x.route === route);
};
