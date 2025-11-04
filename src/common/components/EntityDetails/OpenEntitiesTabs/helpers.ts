import type { Assembly } from "common/types/globalTypes";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { isValidOpenEntity } from "common/OpenEntitiesContext";
import type { AnyOpenEntity, CandidateOpenEntity } from "common/OpenEntitiesContext";
import { validEntityTypes, entityTabsConfig } from "common/entityTabsConfig";
import type { AnyTabRoute, AnyEntityType } from "common/entityTabsConfig";

const openEntityListDelimiter = ",";
const openEntityDelimiter = "/";

/**
 *
 * @param urlOpen properly formatted URI Encoded query parameter representing ```OpenEntity[]``` state
 * @returns ```OpenEntity[]```
 */
export function decompressOpenEntitiesFromURL(urlOpenEntities: string | null): AnyOpenEntity[] {
  return decompressFromEncodedURIComponent(urlOpenEntities)
    .split(openEntityListDelimiter)
    .map((entry) => {
      const [encodedAssembly, encodedEntityType, entityID, encodedTab = ""] = entry.split(openEntityDelimiter);
      const decodedEntity: CandidateOpenEntity = {
        assembly: assemblyDecoding[encodedAssembly],
        entityType: decodeEntityType(encodedEntityType),
        entityID,
        tab: decodeTabRoute(encodedTab),
      };
      if (isValidOpenEntity(decodedEntity)) {
        return decodedEntity;
      } else return null;
    })
    .filter((x) => x !== null && x.entityID); // filter out any invalid
}

/**
 *
 * @param openEntities
 * @returns URI encoded query parameter representing the ```OpenEntity[]``` state
 */
export function compressOpenEntitiesToURL(openEntities: AnyOpenEntity[]): string {
  return compressToEncodedURIComponent(
    openEntities
      .map((x) =>
        [assemblyEncoding[x.assembly], encodeEntityType(x.entityType), x.entityID, encodeTabRoute(x.tab)].join(
          openEntityDelimiter
        )
      )
      .join(openEntityListDelimiter)
  );
}

const encodeEntityType = (entity: AnyEntityType): string => {
  const allEntityTypes = [...new Set(Object.values(validEntityTypes).flat())];
  return String(allEntityTypes.indexOf(entity));
};

const decodeEntityType = (key: string): AnyEntityType => {
  const allEntityTypes = [...new Set(Object.values(validEntityTypes).flat())];
  return allEntityTypes[+key];
};

const encodeTabRoute = (tab: AnyTabRoute): string => {
  const allTabRoutes: AnyTabRoute[] = Object.values(entityTabsConfig)
    .map((assemblyConfig) => Object.values(assemblyConfig))
    .flat(2)
    .map((x) => x.route);
  return String(allTabRoutes.indexOf(tab));
};

const decodeTabRoute = (key: string): AnyTabRoute => {
  const allTabRoutes: AnyTabRoute[] = Object.values(entityTabsConfig)
    .map((assemblyConfig) => Object.values(assemblyConfig))
    .flat(2)
    .map((x) => x.route);
  return allTabRoutes[+key];
};

const assemblyEncoding: { [key in Assembly]: string } = {
  GRCh38: "h",
  mm10: "m",
};

const assemblyDecoding: { [key: string]: Assembly } = Object.fromEntries(
  Object.entries(assemblyEncoding).map(([entity, encoding]: [Assembly, string]) => [encoding, entity])
);
