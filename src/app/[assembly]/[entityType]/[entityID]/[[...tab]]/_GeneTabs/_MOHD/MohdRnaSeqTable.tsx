import { useMemo } from "react";
import { Table, TableColDef, useSyncedTable } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import type { MohdRnaSeqRow, MohdRnaSeqTableProps } from "./MohdRnaSeqTypes";
import { getScaledValue } from "./MohdRnaSeqTypes";
import { mohdSexColors, mohdSiteColors, mohdStatusColors } from "common/colors";

const initialSort: GridSortModel = [{ field: "value", sort: "desc" }];

const MohdRnaSeqTable = ({ rows, tableProps, loading, error, scale }: MohdRnaSeqTableProps) => {
  const columns: TableColDef<MohdRnaSeqRow>[] = useMemo(
    () => [
      { field: "sample_id", headerName: "Dataset", width: 150 },
      {
        field: "value",
        headerName: scale === "linear" ? "TPM" : "Log10(TPM + 1)",
        width: 130,
        type: "number",
        valueGetter: (_, row) => getScaledValue(row, scale),
        valueFormatter: (v: number) => v?.toFixed(2),
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
      { field: "kit", headerName: "Kit", width: 120 },
    ],
    [scale]
  );

  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted: false });

  return (
    <Table
      {...syncedTableProps}
      label="MOHD RNA-seq TPM"
      rows={rows}
      loading={loading}
      error={error}
      initialState={{ ...syncedTableProps.initialState, columns: { columnVisibilityModel: { kit: false } } }}
    />
  );
};

export default MohdRnaSeqTable;
