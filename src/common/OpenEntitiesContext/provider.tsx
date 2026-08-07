"use client";

import { Dispatch, ReactNode, useMemo, useReducer } from "react";
import { OpenEntityAction, OpenEntityState } from "./types";
import { openEntitiesReducer } from "./reducer";
import { OpenEntitiesContext } from "./context";

export const OpenEntitiesContextProvider = ({ children }: { children: ReactNode }) => {
  // The effect to sync state to url in OpenEntitiesTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openEntities.length before allowing pushes to the url.
  const [openEntities, dispatch] = useReducer(openEntitiesReducer, []);

  // dispatch is stable, so consumers only rerender when openEntities actually changes
  const value = useMemo<[OpenEntityState, Dispatch<OpenEntityAction>]>(() => [openEntities, dispatch], [openEntities]);

  return <OpenEntitiesContext.Provider value={value}>{children}</OpenEntitiesContext.Provider>;
};
