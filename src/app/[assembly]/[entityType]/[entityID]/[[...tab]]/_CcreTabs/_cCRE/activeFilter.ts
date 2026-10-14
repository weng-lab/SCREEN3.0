/**
 * "Active only" as a filter on the table's z-score column, so the plots dim inactive biosamples as they
 * do any the table filters out, and the table's filter panel shows and edits it.
 */

import type { GridFilterModel } from "@mui/x-data-grid-premium";
import type { CcreAssay } from "common/types/globalTypes";

/** The z-score past which a cCRE counts as active in a biosample. */
export const ACTIVE_Z = 1.64;

/** The filter item's id, by which the toggle finds it whatever the reader has edited. */
const ACTIVE_ID = "active-only";

export const isActiveOnly = (model: GridFilterModel) => model.items.some(({ id }) => id === ACTIVE_ID);

export const withActiveOnly = (model: GridFilterModel, assay: CcreAssay, on: boolean): GridFilterModel => {
  const items = model.items.filter(({ id }) => id !== ACTIVE_ID);
  return {
    ...model,
    items: on ? [...items, { id: ACTIVE_ID, field: assay, operator: ">=", value: ACTIVE_Z }] : items,
  };
};

/** The filter moved onto another assay's column, as the view keeps its table across assays. */
export const retargetActiveOnly = (model: GridFilterModel, assay: CcreAssay): GridFilterModel =>
  model.items.some(({ id, field }) => id === ACTIVE_ID && field !== assay)
    ? { ...model, items: model.items.map((item) => (item.id === ACTIVE_ID ? { ...item, field: assay } : item)) }
    : model;
