import type { Assembly } from "common/types/globalTypes";
import {
  entityTabsConfig,
  humanBedTabs,
  humanCcreTabs,
  humanGeneTabs,
  humanGwasTabs,
  humanRegionTabs,
  humanVariantTabs,
  mouseBedTabs,
  mouseCcreTabs,
  mouseGeneTabs,
  mouseRegionTabs,
  validEntityTypes,
} from "./entityTabsConfig";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";
import { ReactElement } from "react";

export type EntityType<A extends Assembly> = (typeof validEntityTypes)[A][number];
export type AnyEntityType = EntityType<"GRCh38"> | EntityType<"mm10">;

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
type HumanBedRoutes = ExtractRoutes<typeof humanBedTabs>;

type MouseGeneRoutes = ExtractRoutes<typeof mouseGeneTabs>;
type MouseCcreRoutes = ExtractRoutes<typeof mouseCcreTabs>;
type MouseRegionRoutes = ExtractRoutes<typeof mouseRegionTabs>;
type MouseBedRoutes = ExtractRoutes<typeof mouseBedTabs>;

export type AnyTabRoute =
  | HumanVariantRoutes
  | HumanGeneRoutes
  | HumanCcreRoutes
  | HumanRegionRoutes
  | HumanGwasRoutes
  | HumanBedRoutes
  | MouseGeneRoutes
  | MouseCcreRoutes
  | MouseRegionRoutes
  | MouseBedRoutes;

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
          : E extends "bed"
            ? readonly TabConfig<HumanBedRoutes>[]
            : readonly TabConfig<HumanRegionRoutes>[]
  : E extends "ccre"
    ? readonly TabConfig<MouseCcreRoutes>[]
    : E extends "gene"
      ? readonly TabConfig<MouseGeneRoutes>[]
      : E extends "bed"
        ? readonly TabConfig<MouseBedRoutes>[]
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
