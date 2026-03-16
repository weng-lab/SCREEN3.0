import { GeneExpressionTableProps, getTPM, getLogTPM, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useMemo } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";

const initialSort: GridSortModel = [{ field: "tpm", sort: "desc" }];

const GeneExpressionTable = ({ label, rows, loading, error, tableProps, viewBy, scale }: GeneExpressionTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, viewBy, initialSort);

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
        field: "tpm",
        headerName: scale === "linearTPM" ? "TPM" : "Log10(TPM + 1)",
        type: "number",
        valueGetter: (_, row) => {
          return (scale === "logTPM" ? getLogTPM(row) : getTPM(row)).toFixed(2);
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

export default GeneExpressionTable;
