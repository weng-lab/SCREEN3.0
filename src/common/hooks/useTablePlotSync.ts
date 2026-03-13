import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import type { GridApi } from "@mui/x-data-grid-premium";
import type { RefObject } from "react";
import { TableProps } from "@weng-lab/ui-components";

/**
 * Shallow equality check for arrays by element reference.
 * Used to prevent unnecessary state updates when the DataGrid
 * fires events but the actual row order/content hasn't changed.
 */
function arraysShallowEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

type UseTablePlotSyncOptions<T> = {
  /** Pre-transformed rows to display in the table */
  rows: T[];
  /** Extract a unique string ID from a row (must match getRowId passed to <Table>) */
  getRowId: (row: T) => string;
};

/**
 * Manages shared state between a table and its companion plots.
 *
 * Handles:
 * - Selection state (bidirectional between table checkboxes and plot clicks)
 * - Syncing the table's sorted/filtered rows to plots via DataGrid events
 * - Providing table props to spread onto <Table>
 */
export function useTablePlotSync<T>({ rows, getRowId }: UseTablePlotSyncOptions<T>) {
  const [selected, setSelected] = useState<T[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<T[]>([]);
  const apiRef = useGridApiRef();

  // Use refs so stable callbacks always access current values
  const getRowIdRef = useRef(getRowId);
  const rowsRef = useRef(rows);
  useEffect(() => {
    getRowIdRef.current = getRowId;
    rowsRef.current = rows;
  });

  const stableGetRowId = useCallback((r: T) => getRowIdRef.current(r), []);

  /**
   * Called via Table's `onReady` prop once the DataGrid has mounted.
   * Subscribes to sortedRowsSet and filteredRowsSet events which fire
   * AFTER the DataGrid has recomputed its rows — replacing the old
   * onStateChange + setTimeout(0) hack.
   */
  const onTableReady = useCallback((readyApiRef: RefObject<GridApi>) => {
    const sync = () => {
      const newRows = gridFilteredSortedRowEntriesSelector(readyApiRef).map((x) => x.model) as T[];
      setSortedFilteredData((prev) => (arraysShallowEqual(prev, newRows) ? prev : newRows));
    };
    sync(); // initial sync
    return [
      readyApiRef.current.subscribeEvent("sortedRowsSet", sync),
      readyApiRef.current.subscribeEvent("filteredRowsSet", sync),
    ];
  }, []);

  const handleRowSelectionModelChange = useCallback(
    (model: GridRowSelectionModel) => {
      if (model.type === "include") {
        const newSelected = Array.from(model.ids)
          .map((id) => rowsRef.current.find((r) => stableGetRowId(r) === String(id)))
          .filter(Boolean) as T[];
        setSelected(newSelected);
      } else {
        // type "exclude" with 0 ids = select all
        setSelected([...rowsRef.current]);
      }
    },
    [stableGetRowId]
  );

  /** Toggle a single item's selection state. Use for plot click handlers. */
  const toggleSelection = useCallback(
    (item: T) => {
      const id = stableGetRowId(item);
      setSelected((prev) =>
        prev.some((x) => stableGetRowId(x) === id) ? prev.filter((x) => stableGetRowId(x) !== id) : [...prev, item]
      );
    },
    [stableGetRowId]
  );

  const rowSelectionModel: GridRowSelectionModel = useMemo(
    () => ({
      type: "include" as const,
      ids: new Set(selected.map((x) => getRowId(x))),
    }),
    [selected, getRowId]
  );


  const tableProps = useMemo(
    () => ({
      apiRef,
      checkboxSelection: true as const,
      onRowSelectionModelChange: handleRowSelectionModelChange,
      rowSelectionModel,
      keepNonExistentRowsSelected: true,
      onReady: onTableReady,
      getRowId: stableGetRowId,
    }),
    [apiRef, handleRowSelectionModelChange, rowSelectionModel, onTableReady, stableGetRowId]
  ) satisfies Partial<TableProps>;

  return {
    selected,
    setSelected,
    sortedFilteredData,
    apiRef,
    tableProps,
    toggleSelection,
  };
}
