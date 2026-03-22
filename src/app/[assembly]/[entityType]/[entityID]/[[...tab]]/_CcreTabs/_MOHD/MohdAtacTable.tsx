import { Table, TableColDef, useSyncedTable } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import type { MohdAtacRow, MohdAtacTableProps } from "./MohdAtacTypes";
import { mohdProtocolColors, mohdSexColors, mohdSiteColors, mohdStatusColors } from "common/colors";

const initialSort: GridSortModel = [{ field: "value", sort: "desc" }];

const columns: TableColDef<MohdAtacRow>[] = [
  { field: "sample_id", headerName: "Dataset", width: 150 },
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
  { field: "opc_id", headerName: "Kit", width: 120 },
];

const MohdAtacTable = ({ rows, tableProps, loading, error }: MohdAtacTableProps) => {
  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted: false });

  return (
    <Table
      {...syncedTableProps}
      label="MOHD ATAC Z-Scores"
      rows={rows}
      loading={loading}
      error={error}
      initialState={{ ...syncedTableProps.initialState, columns: { columnVisibilityModel: { opc_id: false } } }}
    />
  );
};

export default MohdAtacTable;
