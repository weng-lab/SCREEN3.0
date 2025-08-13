"use client";

import { createContext, Dispatch, useReducer } from "react";
import { EntityType, TabRoute, Assembly } from "types/globalTypes";

export type OpenEntity = { assembly: Assembly; entityType: EntityType; entityID: string, tab: TabRoute };

export type OpenEntityState = OpenEntity[];

export type OpenEntityAction =
  | { type: "addEntity"; entity: OpenEntity }
  | { type: "removeEntity"; entity: OpenEntity }
  | { type: "updateEntity"; entity: OpenEntity }
  | { type: "reorder"; entity: OpenEntity; startIndex: number; endIndex: number }
  | { type: "sort" }
  | { type: "setState"; state: OpenEntityState };

const openEntitiesReducer = (openEntities: OpenEntityState, action: OpenEntityAction) => {
  let newState: OpenEntityState
  switch (action.type) {
    //Add Entity to the end of the part of the array containing the assembly, if none exist add to the end
    case "addEntity": {
      if (openEntities.some((el) => el.entityID === action.entity.entityID)) {
        newState = openEntities;
      } else {
        const lastIndexOfAssembly = openEntities.findLastIndex((x) => x.assembly === action.entity.assembly);
        if (lastIndexOfAssembly !== -1) { // if that assembly is open already, add to end of that part of list
          const newEntities = [...openEntities]
          newEntities.splice(lastIndexOfAssembly + 1, 0, action.entity)
          newState = newEntities;
        } else { // else add to the end
          newState = [...openEntities, action.entity];
        }
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
      const humanList = Array.from(openEntities.filter(x => x.assembly === "GRCh38"))
      const mouseList = Array.from(openEntities.filter(x => x.assembly === "mm10"))

      const listToReorder = action.entity.assembly === "GRCh38" ? humanList : mouseList

      const [removed] = listToReorder.splice(action.startIndex, 1);
      listToReorder.splice(action.endIndex, 0, removed)

      const humanListIsFirst = openEntities[0].assembly === "GRCh38"

      if (humanListIsFirst){
        newState = [...humanList, ...mouseList]
      } else newState = [...mouseList, ...humanList]

      break;
    }
    case "sort": {
      const humanList = Array.from(openEntities.filter(x => x.assembly === "GRCh38"))
      const mouseList = Array.from(openEntities.filter(x => x.assembly === "mm10"))
      
      const sortOrder: EntityType[] = ["region", "gene", "ccre", "variant"];
      
      const sortFn = (a: OpenEntity, b: OpenEntity) => {
        const typeComparison = sortOrder.indexOf(a.entityType) - sortOrder.indexOf(b.entityType);
        if (typeComparison === 0) {
          return a.entityID.localeCompare(b.entityID);
        }
        return typeComparison;
      }

      humanList.sort(sortFn)
      mouseList.sort(sortFn)

      const humanListIsFirst = openEntities[0].assembly === "GRCh38"

      if (humanListIsFirst){
        newState = [...humanList, ...mouseList]
      } else newState = [...mouseList, ...humanList]

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
  // The effect to sync state to url in OpenEntitiesTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openEntities.length before allowing pushes to the url.
  const [openEntities, dispatch] = useReducer(openEntitiesReducer, []);

  return <OpenEntitiesContext.Provider value={[openEntities, dispatch]}>{children}</OpenEntitiesContext.Provider>;
};
