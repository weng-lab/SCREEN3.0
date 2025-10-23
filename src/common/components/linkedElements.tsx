import { Stack } from "@mui/material";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { LinkedICREInfo } from "common/hooks/useLinkedICREs";
import { Table, TableProps } from "@weng-lab/ui-components";

export type TableDef<T extends LinkedGeneInfo | LinkedICREInfo> = TableProps & {
  sortColumn: keyof T & string; // Constrain to string keys
  sortDirection: "asc" | "desc";
};

export default function LinkedElements<T extends LinkedGeneInfo | LinkedICREInfo>({
  tables,
}: {
  tables: TableDef<T>[];
}) {
  return (
    <Stack spacing={2}>
      {tables.map((table, index) => (
        <Table
          key={index}
          initialState={{
            sorting: {
              sortModel: [{ field: table.sortColumn, sort: table.sortDirection }],
            },
          }}
          {...table}
          divHeight={{ height: "400px" }}
        />
      ))}
    </Stack>
  );
}
