import { useEffect, useMemo } from "react";
import { Table } from "@weng-lab/ui-components";
import { GridColumnVisibilityModel, GridSortModel } from "@mui/x-data-grid-premium";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { CcreAssay } from "common/types/globalTypes";
import { CCRE_ASSAYS } from "common/consts";
import { formatAssay } from "common/utility";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";
import type { AssayTableProps } from "./types";

const makeColumnVisibiltyModel = (assay: CcreAssay): GridColumnVisibilityModel => {
  const hidden = { ontology: false, sampleType: false, lifeStage: false, tf: false };
  CCRE_ASSAYS.forEach((x) => {
    if (x !== assay) Object.defineProperty(hidden, x, { value: false, enumerable: true });
  });
  return hidden;
};

const AssayTable = ({ rows, columns, assay, entity, tableProps, isPresorted }: AssayTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;

  const initialSort: GridSortModel = useMemo(() => [{ field: assay, sort: "desc" as const }], [assay]);

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, initialSort, isPresorted);

  // Update column visibility and sort column when assay changes
  useEffect(() => {
    if (!apiRef.current) return;
    apiRef.current.setColumnVisibilityModel(makeColumnVisibiltyModel(assay));
    apiRef.current.sortColumn(assay, "desc");
  }, [apiRef, assay]);

  /**
   * Resize cols on assay change. Need to use requestAnimationFrame to queue this update until after
   * the column changes are completed. This calls the autosize method right before the next repaint.
   */
  useEffect(() => {
    if (!apiRef.current) return;
    const frame = requestAnimationFrame(() => {
      apiRef.current?.autosizeColumns({
        expand: true,
        includeHeaders: true,
        outliersFactor: 1.5,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [apiRef, assay]);

  const allColumns = useMemo(() => [sortableTableCheckboxColumn, ...columns], [columns]);

  return (
    <Table
      label={`${entity.entityID} ${formatAssay(assay)} z-scores`}
      rows={rows}
      loading={!rows}
      columns={allColumns}
      apiRef={apiRef}
      disableColumnSorting={isPresorted}
      initialState={{
        columns: { columnVisibilityModel: makeColumnVisibiltyModel(assay) },
        sorting: { sortModel: initialSort },
      }}
      toolbarSlot={<AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />}
      onReady={(api) => {
        const existing = tableSyncOnReady?.(api);
        const existingCleanups = Array.isArray(existing) ? existing : existing ? [existing] : [];
        return [...existingCleanups, ...autoSortOnReady(api)];
      }}
      {...restTableProps}
    />
  );
};

export default AssayTable;
