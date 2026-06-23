import { useEffect, useMemo } from "react";
import { Table, useSyncedTable } from "@weng-lab/ui-components";
import { GridColumnVisibilityModel, GridSortModel } from "@mui/x-data-grid-premium";
import { CcreAssay } from "common/types/globalTypes";
import { CCRE_ASSAYS } from "common/assays";
import { formatAssay } from "common/assays";
import type { AssayTableProps } from "./types";

const makeColumnVisibiltyModel = (assay: CcreAssay): GridColumnVisibilityModel => {
  const hidden = { ontology: false, sampleType: false, lifeStage: false, tf: false };
  CCRE_ASSAYS.forEach((x) => {
    if (x !== assay) Object.defineProperty(hidden, x, { value: false, enumerable: true });
  });
  return hidden;
};

const AssayTable = ({ rows, columns, assay, entityID, tableProps, isPresorted }: AssayTableProps) => {
  const initialSort: GridSortModel = useMemo(() => [{ field: assay, sort: "desc" }], [assay]);

  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted });

  // Update column visibility and sort column when assay changes
  useEffect(() => {
    if (!syncedTableProps.apiRef.current) return;
    syncedTableProps.apiRef.current.setColumnVisibilityModel(makeColumnVisibiltyModel(assay));
  }, [syncedTableProps.apiRef, assay]);

  return (
    <Table
      {...syncedTableProps}
      label={`${entityID} ${formatAssay(assay)} z-scores`}
      rows={rows}
      loading={!rows}
      initialState={{
        ...syncedTableProps.initialState,
        columns: { columnVisibilityModel: makeColumnVisibiltyModel(assay) },
      }}
    />
  );
};

export default AssayTable;
