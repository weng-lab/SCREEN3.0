/**
 * "Active only" as a filter on the table's score column, so the plots dim inactive biosamples as they
 * do any the table filters out, and the table's filter panel shows and edits it.
 */

import type { GridFilterModel } from "@mui/x-data-grid-premium";
import { SCORE_FIELD } from "./types";

/** The z-score past which a cCRE counts as active in a biosample. */
export const ACTIVE_Z = 1.64;

/** The filter item's id, by which the toggle finds it whatever the reader has edited. */
const ACTIVE_ID = "active-only";

export const isActiveOnly = (model: GridFilterModel) => model.items.some(({ id }) => id === ACTIVE_ID);

export const withActiveOnly = (model: GridFilterModel, on: boolean): GridFilterModel => {
  const items = model.items.filter(({ id }) => id !== ACTIVE_ID);
  return {
    ...model,
    items: on ? [...items, { id: ACTIVE_ID, field: SCORE_FIELD, operator: ">=", value: ACTIVE_Z }] : items,
  };
};
