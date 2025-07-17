"use client";

import { createContext, Dispatch, useReducer } from "react";
import { GenomicElementType, TabRoute } from "types/globalTypes";

export type OpenElement = { elementType: GenomicElementType; elementID: string, tab: TabRoute };

export type OpenElementsAction =
  | { type: "addElement"; element: OpenElement }
  | { type: "removeElement"; element: OpenElement }
  | { type: "updateElement"; element: OpenElement }
  | { type: "reorder"; element: OpenElement; startIndex: number; endIndex: number }
  | { type: "setState"; state: OpenElementsState }

export type OpenElementsState = OpenElement[];

const openElementsReducer = (openElements: OpenElementsState, action: OpenElementsAction) => {

  let newState: OpenElementsState
  switch (action.type) {
    case "addElement": {
      if (openElements.some((el) => el.elementID === action.element.elementID)) {
        newState = openElements;
      } else {
        newState = [...openElements, action.element];
      }
      break;
    }
    case "removeElement": {
      if (openElements.length > 1) {
        newState = openElements.filter(
          (el) => el.elementID !== action.element.elementID || el.elementType !== action.element.elementType
        );
      } else newState = openElements;
      break;
    }
    case "updateElement": {
      newState = openElements.map((el) => (el.elementID === action.element.elementID ? action.element : el));
      break;
    }
    case "reorder": {
      const result = Array.from(openElements);
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
  // console.log("Dispatch called: ")
  // console.log({action, openElements})
  // console.log("New State:")
  // console.log(newState)
  return newState
};

export const OpenElementsContext = createContext<[OpenElementsState, Dispatch<OpenElementsAction>]>(null);

export const OpenElementsContextProvider = ({ children }) => {
  // The effect to sync state to url in OpenElementsTabs relies on this being an empty array on initial load.
  // (and only ever being an empty array on initial load)
  // It checks openElements.length before allowing pushes to the url.
  const [openElements, dispatch] = useReducer(openElementsReducer, []);

  return <OpenElementsContext.Provider value={[openElements, dispatch]}>{children}</OpenElementsContext.Provider>;
};
