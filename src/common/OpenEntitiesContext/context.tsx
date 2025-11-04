"use client";

import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { OpenEntityAction, OpenEntityState } from "./types";
import { openEntitiesReducer } from "./reducer";

export const OpenEntitiesContext = createContext<[OpenEntityState, Dispatch<OpenEntityAction>]>(null);

export const OpenEntitiesContextProvider = ({ children }: { children: ReactNode }) => {
  // The effect to sync state to url in OpenEntitiesTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openEntities.length before allowing pushes to the url.
  const [openEntities, dispatch] = useReducer(openEntitiesReducer, []);

  return <OpenEntitiesContext.Provider value={[openEntities, dispatch]}>{children}</OpenEntitiesContext.Provider>;
};