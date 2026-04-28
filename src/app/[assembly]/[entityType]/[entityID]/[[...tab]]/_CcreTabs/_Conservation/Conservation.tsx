"use client";
import React from "react";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import ConservationAndOrthologTables from "./ConservationAndOrthologTables";

export const Conservation = ({ entity }: EntityViewComponentProps) => {
  return <ConservationAndOrthologTables entity={entity} />;
};
