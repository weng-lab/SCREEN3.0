import { useEffect } from "react";
import type { RefObject } from "react";
import type { GridApi, GridSortModel } from "@mui/x-data-grid-premium";

/**
 * Manages the "auto-sort selected rows to top" behavior for a DataGrid.
 *
 * When `autoSort` is true, ensures the __check__ column is always the primary
 * sort so that selected rows float to the top. Handles three concerns:
 * 1. Resetting sort when autoSort or viewBy changes
 * 2. Re-inserting __check__ after user-initiated sort changes
 * 3. Re-applying sort when row selection changes (DataGrid doesn't auto-re-sort)
 */
export function useAutoSort(
  apiRef: RefObject<GridApi>,
  autoSort: boolean,
  viewBy: string,
  initialSort: GridSortModel
): void {
  // When autoSort or viewBy changes, reset to the canonical sort for the current view.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    const base: GridSortModel = viewBy === "byTissueTPM" ? [] : initialSort;
    api.setSortModel(autoSort ? [{ field: "__check__", sort: "desc" }, ...base] : base);
  }, [apiRef, autoSort, viewBy, initialSort]);

  // While autoSort is on, keep __check__ as primary sort after any user-initiated sort change.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !autoSort) return;
    return api.subscribeEvent("sortModelChange", (model) => {
      if (model[0]?.field === "__check__") return;
      const withoutCheck = model.filter((s) => s.field !== "__check__");
      api.setSortModel([{ field: "__check__", sort: "desc" }, ...withoutCheck]);
    });
  }, [apiRef, autoSort]);

  // Re-apply sort when selection changes while autoSort is active.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api || !autoSort) return;
    return api.subscribeEvent("rowSelectionChange", () => {
      api.setSortModel([...api.getSortModel()]);
    });
  }, [apiRef, autoSort]);

  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;
    return api.subscribeEvent("rowClick", () => {
      console.log("row clicked");
    });
  }, [apiRef]);

}
