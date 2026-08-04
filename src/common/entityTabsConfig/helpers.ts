import { Assembly } from "common/types/globalTypes";
import type { EntityType, TabConfig } from "./types";
import { entityTabsConfig } from "./entityTabsConfig";
import type { AnyOpenEntity } from "common/OpenEntitiesContext";

// Helper to generate tab array for EntityDetailsTabs
export const getTabsForEntity = <A extends Assembly, E extends EntityType<A>>(
  assembly: A,
  entityType: E
): readonly TabConfig[] => {
  return entityTabsConfig[assembly][entityType];
};

// Helper to get component for given OpenEntity. Undefined if the entity's tab has no matching config
export const getComponentForEntity = (openEntity: AnyOpenEntity) => {
  switch (openEntity.assembly) {
    case "GRCh38":
      return entityTabsConfig.GRCh38[openEntity.entityType as EntityType<"GRCh38">].find(
        (x) => x.route === openEntity.tab
      )?.component;
    case "mm10":
      return entityTabsConfig.mm10[openEntity.entityType as EntityType<"mm10">].find((x) => x.route === openEntity.tab)
        ?.component;
  }
};

/**
 *
 * @param subpath
 * @returns A formatted portal name for the passed string. If no matching portal returns null
 */
export function formatPortal(subpath: string): string {
  switch (subpath) {
    case "variant":
      return "Variant";
    case "gene":
      return "Gene";
    case "ccre":
      return "cCRE";
    case "region":
      return "Region";
    case "gwas":
      return "GWAS";
    default:
      return null;
  }
}
