"use client";
import { Stack } from "@mui/material";
import { LinkedGeneInfo } from "common/hooks/useLinkedGenes";
import { useLinkedCcresReturn } from "common/hooks/useLinkedCcres";
import { Table, TableProps } from "@weng-lab/ui-components";
import { useCompuLinkedcCREsReturn } from "common/hooks/useCompuLinkedcCREs";

export type TableDef<T extends LinkedGeneInfo | useLinkedCcresReturn["data"][number] | useCompuLinkedcCREsReturn["data"][number]> = TableProps & {
  sortColumn: keyof T & string; // Constrain to string keys
  sortDirection: "asc" | "desc";
};

export default function LinkedElements<T extends LinkedGeneInfo | useLinkedCcresReturn["data"][number] | useCompuLinkedcCREsReturn["data"][number]>({
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
