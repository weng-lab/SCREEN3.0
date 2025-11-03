import type { EntityType, EntityRoute } from "common/entityTabsConfig/types";
import { Assembly } from "common/types/globalTypes";

export type OpenEntity<A extends Assembly> = {
  assembly: A;
  entityType: EntityType<A>;
  entityID: string;
  tab: EntityRoute<A, EntityType<A>>;
};

/**
 * Can't simply define this as OpenEntity<Assembly> since then `tab` has the type EntityRoute<Assembly, EntityType<Assembly>>,
 * which resolves to only the routes of entities shared by all Assemblies
 */
export type AnyOpenEntity = OpenEntity<"GRCh38"> | OpenEntity<"mm10">;

// Utility type to be used prior to ensuring that Assembly/EntityType/TabRoute combo is valid
export type CandidateOpenEntity = {
  assembly: string;
  entityType: string;
  entityID: string;
  tab: string;
};

export type OpenEntityState = AnyOpenEntity[];

export type OpenEntityAction =
  | { type: "addEntity"; entity: AnyOpenEntity }
  | { type: "removeEntity"; entity: AnyOpenEntity }
  | { type: "updateEntity"; entity: AnyOpenEntity }
  | { type: "reorder"; entity: AnyOpenEntity; startIndex: number; endIndex: number }
  | { type: "sort" }
  | { type: "setState"; state: OpenEntityState };
