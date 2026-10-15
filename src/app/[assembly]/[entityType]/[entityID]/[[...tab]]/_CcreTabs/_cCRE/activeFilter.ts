/**
 * "Active only" as a filter on the table's score column, so the plots dim inactive biosamples as they
 * do any the table filters out, and the table's filter panel shows and edits it.
 */

import type { GridFilterItem, GridFilterModel } from "@mui/x-data-grid-premium";
import { SCORE_FIELD } from "./types";

/** The z-score past which a cCRE counts as active in a biosample. */
export const ACTIVE_Z = 1.64;

const ACTIVE_ID = "active-only";

/** On for exactly Z ≥ 1.64, off for no filter, and "other" once the reader filters the column some other way. */
type ActiveOnly = "on" | "off" | "other";

/** Whether an item filters anything: it has a value, or an operator that takes none. */
const applies = ({ operator, value }: GridFilterItem) =>
  operator === "isEmpty" || operator === "isNotEmpty" || (value != null && value !== "");

export const activeOnlyState = (model: GridFilterModel): ActiveOnly => {
  const items = model.items.filter((item) => item.field === SCORE_FIELD && applies(item));
  if (items.length === 0) return "off";
  const [{ operator, value }] = items;
  // By value: the filter panel can hand it back as a string.
  return items.length === 1 && operator === ">=" && Number(value) === ACTIVE_Z ? "on" : "other";
};

/** The score column's filters replaced by Z ≥ 1.64, or cleared. */
export const withActiveOnly = (model: GridFilterModel, on: boolean): GridFilterModel => {
  const items = model.items.filter(({ field }) => field !== SCORE_FIELD);
  return {
    ...model,
    items: on ? [...items, { id: ACTIVE_ID, field: SCORE_FIELD, operator: ">=", value: ACTIVE_Z }] : items,
  };
};
