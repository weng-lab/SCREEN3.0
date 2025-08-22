"use client";

import { createContext, Dispatch, useReducer } from "react";
import { EntityType, TabRoute, Assembly } from "types/globalTypes";

export type OpenEntity = { assembly: Assembly; entityType: EntityType; entityID: string; tab: TabRoute };

export type OpenEntityState = OpenEntity[];

export type OpenEntityAction =
  | { type: "addEntity"; entity: OpenEntity }
  | { type: "removeEntity"; entity: OpenEntity }
  | { type: "updateEntity"; entity: OpenEntity }
  | { type: "reorder"; entity: OpenEntity; startIndex: number; endIndex: number }
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
      const entityOrder: EntityType[] = ["region", "gene", "ccre", "variant"];

      const sortFn = (a: OpenEntity, b: OpenEntity) => {
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
