import { useMemo } from "react";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";
import type { MohdRnaSeqRow, MohdRnaSeqTableProps } from "./MohdRnaSeqTypes";
import { getScaledValue } from "./MohdRnaSeqTypes";

const initialSort: GridSortModel = [{ field: "value", sort: "desc" }];

const MohdRnaSeqTable = ({ rows, tableProps, loading, error, scale }: MohdRnaSeqTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, initialSort, false);

  const columns: TableColDef<MohdRnaSeqRow>[] = useMemo(
    () => [
      sortableTableCheckboxColumn,
      { field: "sample_id", headerName: "Sample ID", width: 150 },
      {
        field: "value",
        headerName: scale === "linear" ? "TPM" : "Log\u2081\u2080(TPM + 1)",
        width: 130,
        type: "number",
        valueGetter: (_, row) => getScaledValue(row, scale),
        valueFormatter: (v: number) => v?.toFixed(2),
      },
      { field: "kit", headerName: "Kit", width: 120 },
      { field: "sex", headerName: "Sex", width: 80 },
      { field: "site", headerName: "Site", width: 80 },
      { field: "status", headerName: "Status", width: 100 },
    ],
    [scale]
  );

  return (
    <Table
      label="MOHD RNA-seq TPM"
      rows={rows}
      columns={columns}
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

export default MohdRnaSeqTable;
