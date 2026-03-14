import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { GridApi, GridSortModel } from "@mui/x-data-grid-premium";

type UseAutoSortReturn = {
  autoSort: boolean;
  setAutoSort: (value: boolean) => void;
  onReady: (readyApiRef: RefObject<GridApi>) => (() => void)[];
};

/**
 * Manages the "auto-sort selected rows to top" behavior for a DataGrid.
 *
 * Owns the autoSort toggle state and all related DataGrid behavior, returning
 * `autoSort` and `setAutoSort` for use in a toolbar toggle, and `onReady` to
 * be composed with the Table's `onReady` prop.
 *
 * `onReady` is used for event subscriptions rather than plain useEffects because
 * the Table is wrapped in <NoSsr>, which defers DataGrid initialization — subscriptions
 * attempted on mount may attach before the api is ready. `onReady` fires inside the
 * NoSsr boundary after the DataGrid is fully initialized.
 *
 * The sort model reset remains a reactive useEffect because it must fire on every
 * autoSort/viewBy change, not just on mount.
 */
export function useAutoSort(apiRef: RefObject<GridApi>, viewBy: string, initialSort: GridSortModel): UseAutoSortReturn {
  const [autoSort, setAutoSort] = useState(false);

  // Track autoSort in a ref so event handlers always see the current value
  // without needing to unsubscribe and re-subscribe on every change.
  const autoSortRef = useRef(autoSort);
  useEffect(() => {
    autoSortRef.current = autoSort;
  });

  // Reactive: reset sort model when autoSort or viewBy changes.
  // The null guard handles any edge case where this runs before the DataGrid is ready.
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    const base: GridSortModel = viewBy === "byTissueTPM" ? [] : initialSort;
    api.setSortModel(autoSort ? [{ field: "__check__", sort: "desc" }, ...base] : base);
  }, [apiRef, autoSort, viewBy, initialSort]);

  // Return a stable onReady callback that attaches event subscriptions once,
  // after the DataGrid has fully mounted. Handlers read autoSortRef at event
  // time so they reflect the current autoSort state without re-subscribing.
  const onReady = useCallback(
    (readyApiRef: RefObject<GridApi>) => [
      // Keep __check__ as the primary sort after any user-initiated sort change.
      // Guard against infinite loop: if __check__ is already first, the call was ours — skip it.
      readyApiRef.current.subscribeEvent("sortModelChange", (model) => {
        if (!autoSortRef.current || model[0]?.field === "__check__") return;
        const withoutCheck = model.filter((s) => s.field !== "__check__");
        readyApiRef.current.setSortModel([{ field: "__check__", sort: "desc" }, ...withoutCheck]);
      }),
      // Re-apply sort when selection changes — DataGrid doesn't re-sort automatically
      // when checkbox state changes.
      readyApiRef.current.subscribeEvent("rowSelectionChange", () => {
        if (!autoSortRef.current) return;
        readyApiRef.current.setSortModel([...readyApiRef.current.getSortModel()]);
      }),
    ],
    []
  );

  return { autoSort, setAutoSort, onReady };
}
