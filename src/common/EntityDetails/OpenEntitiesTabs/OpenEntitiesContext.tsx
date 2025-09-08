"use client";

import { createContext, Dispatch, useReducer } from "react";
import { Assembly, isValidAssembly } from "types/globalTypes";
import { AnyEntityType, AnyTabRoute, EntityRoute, EntityType, isValidEntityType, isValidRouteForEntity } from "../entityTabsConfig";

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
export type AnyOpenEntity = OpenEntity<"GRCh38"> | OpenEntity<"mm10">

// Utility type to be used prior to ensuring that Assembly/EntityType/TabRoute combo is valid
export type CandidateOpenEntity = {
  assembly: string;
  entityType: string;
  entityID: string;
  tab: string;
}

export const isValidOpenEntity = (e: CandidateOpenEntity): e is AnyOpenEntity => {
  return isValidAssembly(e.assembly) && isValidEntityType(e.assembly, e.entityType) && isValidRouteForEntity(e.assembly, e.entityType, e.tab)
}

export type OpenEntityState = AnyOpenEntity[];

export type OpenEntityAction =
  | { type: "addEntity"; entity: AnyOpenEntity }
  | { type: "removeEntity"; entity: AnyOpenEntity }
  | { type: "updateEntity"; entity: AnyOpenEntity }
  | { type: "reorder"; entity: AnyOpenEntity; startIndex: number; endIndex: number }
  | { type: "sort" }
  | { type: "setState"; state: OpenEntityState };


const openEntitiesReducer = (openEntities: OpenEntityState, action: OpenEntityAction) => {
  let newState: OpenEntityState;
  switch (action.type) {
    //Add Entity to the end of the part of the array containing the assembly, if none exist add to the end
    case "addEntity": {
      if (openEntities.some((el) => el.entityID === action.entity.entityID && el.assembly === action.entity.assembly)) {
        newState = openEntities;
      } else {
        newState = [...openEntities, action.entity];
      }
      break;
    }
    case "removeEntity": {
      if (openEntities.length > 1) {
        newState = openEntities.filter(
          (el) => el.entityID !== action.entity.entityID || el.entityType !== action.entity.entityType || el.assembly !== action.entity.assembly
        );
      } else newState = openEntities;
      break;
    }
    case "updateEntity": {
      newState = openEntities.map((el) => ((el.entityID === action.entity.entityID && el.assembly === action.entity.assembly) ? action.entity : el));
      break;
    }
    case "reorder": {
      const newOpenEntities = [...openEntities];
      const [removed] = newOpenEntities.splice(action.startIndex, 1);
      newOpenEntities.splice(action.endIndex, 0, removed);
      newState = newOpenEntities;
      break;
    }
    case "sort": {
      const assemblyOrder: Assembly[] = ["GRCh38", "mm10"];
      const entityOrder: AnyEntityType[] = ["region", "gene", "ccre", "variant", "gwas"];

      const sortFn = (a: AnyOpenEntity, b: AnyOpenEntity) => {
      const assemblyComparison = assemblyOrder.indexOf(a.assembly) - assemblyOrder.indexOf(b.assembly);
      if (assemblyComparison !== 0) return assemblyComparison;

      const entityComparison = entityOrder.indexOf(a.entityType) - entityOrder.indexOf(b.entityType);
      if (entityComparison !== 0) return entityComparison;

      return a.entityID.localeCompare(b.entityID);
      };

      const newOpenEntities = [...openEntities];
      newOpenEntities.sort(sortFn);

      newState = newOpenEntities;
      break;
    }
    case "setState": {
      newState = action.state;
      break;
    }
  }
  return newState;
};

export const OpenEntitiesContext = createContext<[OpenEntityState, Dispatch<OpenEntityAction>]>(null);

export const OpenEntitiesContextProvider = ({ children }) => {
  // The effect to sync state to url in OpenEntitiesTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openEntities.length before allowing pushes to the url.
  const [openEntities, dispatch] = useReducer(openEntitiesReducer, []);

  return <OpenEntitiesContext.Provider value={[openEntities, dispatch]}>{children}</OpenEntitiesContext.Provider>;
};
