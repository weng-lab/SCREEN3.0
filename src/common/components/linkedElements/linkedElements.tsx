import { Stack } from "@mui/material";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import CustomDataGrid, { CustomDataGridColDef, CustomDataGridProps } from "../CustomDataGrid";

export interface TableDef<T extends LinkedGeneInfo | LinkedICREInfo> extends CustomDataGridProps<T> {
  sortColumn: keyof T & string; // Constrain to string keys
  sortDirection: "asc" | "desc";
}

// Combined types for GridColDef and GridRenderCellParams for linkedGenes and linkedICREs
export type colDef = CustomDataGridColDef<LinkedGeneInfo> | CustomDataGridColDef<LinkedICREInfo>;

export default function LinkedElements<T extends LinkedGeneInfo | LinkedICREInfo>({
  tables,
}: {
  tables: TableDef<T>[];
}) {
  return (
    <Stack spacing={2}>
      {tables.map((table, index) => (
        <CustomDataGrid
          key={index}
          initialState={{
            sorting: {
              sortModel: [{ field: table.sortColumn, sort: table.sortDirection }],
            },
          }}
          {...table}
        />
      ))}
    </Stack>
  );
}
