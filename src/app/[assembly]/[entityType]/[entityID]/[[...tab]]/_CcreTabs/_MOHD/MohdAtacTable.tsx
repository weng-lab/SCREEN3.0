import { useMemo } from "react";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";
import type { MohdAtacRow, MohdAtacTableProps } from "./MohdAtacTypes";
import { mohdProtocolColors, mohdSexColors, mohdSiteColors, mohdStatusColors } from "common/colors";

const initialSort: GridSortModel = [{ field: "value", sort: "desc" }];

const columns: TableColDef<MohdAtacRow>[] = [
  { field: "sample_id", headerName: "Dataset", width: 150 },
  { field: "opc_id", headerName: "Kit", width: 120 },
  { field: "value", headerName: "Z-Score", width: 100, type: "number", valueFormatter: (v: number) => v?.toFixed(2) },
  {
    field: "protocol",
    headerName: "Protocol",
    width: 150,
    type: "singleSelect",
    valueOptions: Object.keys(mohdProtocolColors),
  },
  { field: "sex", headerName: "Sex", width: 80, type: "singleSelect", valueOptions: Object.keys(mohdSexColors) },
  { field: "site", headerName: "Site", width: 80, type: "singleSelect", valueOptions: Object.keys(mohdSiteColors) },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    type: "singleSelect",
    valueOptions: Object.keys(mohdStatusColors),
  },
];

const MohdAtacTable = ({ rows, tableProps, loading, error }: MohdAtacTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, initialSort, false);

  const allColumns = useMemo(() => [sortableTableCheckboxColumn, ...columns], []);

  return (
    <Table
      label="MOHD ATAC Z-Scores"
      rows={rows}
      columns={allColumns}
      loading={loading}
      error={error}
      apiRef={apiRef}
      divHeight={{ height: "100%" }}
      initialState={{ sorting: { sortModel: initialSort } }}
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

export default MohdAtacTable;
