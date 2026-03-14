import { GeneExpressionTableProps, getTPM, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useMemo, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";

const GeneExpressionTable = ({ label, rows, loading, error, tableProps, viewBy, scale }: GeneExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);

  const { apiRef } = tableProps;

  const columns: TableColDef<PointMetadata>[] = useMemo(
    () => [
      sortableTableCheckboxColumn,
      {
        field: "biosample",
        headerName: "Sample",
        sortable: viewBy !== "byTissueTPM",
        valueGetter: (_, row) => {
          return capitalizeFirstLetter(row.biosample);
        },
        //truncate
        renderCell: (params) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 250,
            }}
            title={params.value}
          >
            {params.value}
          </div>
        ),
      },
      {
        field: " ",
        headerName: scale === "linearTPM" ? "TPM" : "Log10(TPM + 1)",
        type: "number",
        valueGetter: (_, row) => {
          return getTPM(row).toFixed(2);
        },
        sortable: viewBy !== "byTissueTPM",
        minWidth: 75,
      },
      {
        field: "tissue",
        headerName: "Organ/Tissue",
        sortable: viewBy !== "byTissueTPM",
      },
      {
        field: "biosample_type",
        headerName: "Biosample Type",
        sortable: viewBy !== "byTissueTPM",
      },
      {
        field: "link",
        headerName: "Experiment",
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (_, row) => {
          return row.accession.split(" ")[0];
        },
        renderCell: (params) => {
          return (
            <IconButton
              href={`https://www.encodeproject.org/experiments/${params.value}/`}
              target="_blank"
              size="small"
            >
              <OpenInNew fontSize="small" />
            </IconButton>
          );
        },
      },
    ],
    [viewBy, scale]
  );

  const initialSort: GridSortModel = useMemo(() => [{ field: "tpm", sort: "desc" }], []);

  useAutoSort(apiRef, autoSort, viewBy, initialSort);

  return (
    <Table
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      initialState={{
        sorting: {
          sortModel: initialSort,
        },
      }}
      divHeight={{ height: "100%" }}
      toolbarSlot={<AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />}
      {...tableProps}
    />
  );
};

export default GeneExpressionTable;
