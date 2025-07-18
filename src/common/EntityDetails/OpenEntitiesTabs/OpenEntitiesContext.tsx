"use client";

import { createContext, Dispatch, useReducer } from "react";
import { EntityType, TabRoute } from "types/globalTypes";

export type OpenEntity = { entityType: EntityType; entityID: string, tab: TabRoute };

export type OpenEntityState = OpenEntity[];

export type OpenEntityAction =
  | { type: "addEntity"; entity: OpenEntity }
  | { type: "removeEntity"; entity: OpenEntity }
  | { type: "updateEntity"; entity: OpenEntity }
  | { type: "reorder"; entity: OpenEntity; startIndex: number; endIndex: number }
  | { type: "setState"; state: OpenEntityState }

const openEntitiesReducer = (openEntities: OpenEntityState, action: OpenEntityAction) => {

  let newState: OpenEntityState
  switch (action.type) {
    case "addEntity": {
      if (openEntities.some((el) => el.entityID === action.entity.entityID)) {
        newState = openEntities;
      } else {
        newState = [...openEntities, action.entity];
      }
      break;
    }
    case "removeEntity": {
      if (openEntities.length > 1) {
        newState = openEntities.filter(
          (el) => el.entityID !== action.entity.entityID || el.entityType !== action.entity.entityType
        );
      } else newState = openEntities;
      break;
    }
    case "updateEntity": {
      newState = openEntities.map((el) => (el.entityID === action.entity.entityID ? action.entity : el));
      break;
    }
    case "reorder": {
      const result = Array.from(openEntities);
      const [removed] = result.splice(action.startIndex, 1);
      result.splice(action.endIndex, 0, removed);

      newState = result;
      break;
    }
    case "setState": {
      newState = action.state
      break;
    }
  }
  return newState
};

export const OpenEntitiesContext = createContext<[OpenEntityState, Dispatch<OpenEntityAction>]>(null);

export const OpenEntitiesContextProvider = ({ children }) => {
  // The effect to sync state to url in OpenElementsTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openElements.length before allowing pushes to the url.
  const [openElements, dispatch] = useReducer(openEntitiesReducer, []);

  return <OpenEntitiesContext.Provider value={[openElements, dispatch]}>{children}</OpenEntitiesContext.Provider>;
};
