import { Assembly } from "common/types/globalTypes";
import {
  entityTabsConfig,
  humanCcreTabs,
  humanGeneTabs,
  humanGwasTabs,
  humanRegionTabs,
  humanVariantTabs,
  mouseCcreTabs,
  mouseGeneTabs,
  mouseRegionTabs,
  validEntityTypes,
} from "./entityTabsConfig";
import type { AnyOpenEntity } from "common/OpenEntitiesContext/types";
import { ReactElement } from "react";

export type EntityType<A extends Assembly> = (typeof validEntityTypes)[A][number];
export type AnyEntityType = EntityType<"GRCh38"> | EntityType<"mm10">;

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

export type EntityViewComponentProps = {
  //This should not have any properties that should be owned by OpenEntitiesContext. Why?
  entity: AnyOpenEntity;
};

type ExtractRoutes<T extends readonly { route: string }[]> = T[number]["route"];

// Individual route types for each entity
type HumanVariantRoutes = ExtractRoutes<typeof humanVariantTabs>;
type HumanGeneRoutes = ExtractRoutes<typeof humanGeneTabs>;
type HumanCcreRoutes = ExtractRoutes<typeof humanCcreTabs>;
type HumanRegionRoutes = ExtractRoutes<typeof humanRegionTabs>;
type HumanGwasRoutes = ExtractRoutes<typeof humanGwasTabs>;

type MouseGeneRoutes = ExtractRoutes<typeof mouseGeneTabs>;
type MouseCcreRoutes = ExtractRoutes<typeof mouseCcreTabs>;
type MouseRegionRoutes = ExtractRoutes<typeof mouseRegionTabs>;

export type AnyTabRoute =
  | HumanVariantRoutes
  | HumanGeneRoutes
  | HumanCcreRoutes
  | HumanRegionRoutes
  | HumanGwasRoutes
  | MouseGeneRoutes
  | MouseCcreRoutes
  | MouseRegionRoutes;

// Generic type to get routes for any assembly/entity combination
export type EntityRoute<A extends Assembly, E extends EntityType<A>> = E extends keyof (typeof entityTabsConfig)[A]
  ? ExtractRoutes<(typeof entityTabsConfig)[A][E]>
  : never;

/**
 * TabList type takes in assembly and EntityType and returns corresponding string literal union
 * The prettier auto-formatting on this is pretty horrendous, apologies
 */

type TabList<A extends Assembly, E extends EntityType<A>> = A extends "GRCh38"
  ? E extends "ccre"
    ? readonly TabConfig<HumanCcreRoutes>[]
    : E extends "gene"
      ? readonly TabConfig<HumanGeneRoutes>[]
      : E extends "variant"
        ? readonly TabConfig<HumanVariantRoutes>[]
        : E extends "gwas"
          ? readonly TabConfig<HumanGwasRoutes>[]
          : readonly TabConfig<HumanRegionRoutes>[]
  : E extends "ccre"
    ? readonly TabConfig<MouseCcreRoutes>[]
    : E extends "gene"
      ? readonly TabConfig<MouseGeneRoutes>[]
      : readonly TabConfig<MouseRegionRoutes>[];

export type EntityTabsConfig = {
  readonly [A in Assembly]: {
    readonly [E in EntityType<A>]: TabList<A, E>;
  };
};

export type TabConfig<R extends string = string> = {
  route: R;
  label: string;
  /**
   * If no icon passed, will place tab in "more" section
   */
  iconPath?: string;
  /**
   * The component to render for that tab view
   */
  component: (props: EntityViewComponentProps) => ReactElement;
  /**
   * Function that takes in the entity and determines if the tab is disabled
   */
  getIsDisabled?: (entityID: string) => Promise<boolean>;
  /**
   * Message to display on hover when mode is disable
   */
  disabledMessage?: string;
};