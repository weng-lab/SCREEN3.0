"use client";

import { createContext, Dispatch } from "react";
import { OpenEntityAction, OpenEntityState } from "./types";

export const OpenEntitiesContext = createContext<[OpenEntityState, Dispatch<OpenEntityAction>]>(null);
