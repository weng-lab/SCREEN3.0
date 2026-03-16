import { GeneExpressionTableProps, getScaledTPM, PointMetadata } from "./types";
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

const GeneExpressionTable = ({
  label,
  rows,
  loading,
  error,
  tableProps,
  isPresorted,
  scale,
}: GeneExpressionTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, initialSort, isPresorted);

  const columns: TableColDef<PointMetadata>[] = useMemo(
    () => [
      sortableTableCheckboxColumn,
      {
        field: "biosample",
        headerName: "Sample",
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
          return getScaledTPM(row, scale);
        },
        valueFormatter: (value: number) => value.toFixed(2),
        minWidth: 75,
      },
      {
        field: "tissue",
        headerName: "Organ/Tissue",
      },
      {
        field: "biosample_type",
        headerName: "Biosample Type",
      },
      {
        field: "link",
        headerName: "Experiment",
        sortable: false,
        disableColumnMenu: true,
        valueGetter: (_, row) => row.exp_accession,
        renderCell: (params) => {
          const biorep = params.row.biorep;
          return (
            <>
              <IconButton
                href={`https://www.encodeproject.org/experiments/${params.value}/`}
                target="_blank"
                size="small"
              >
                <OpenInNew fontSize="small" />
              </IconButton>
              {biorep != null && ` rep. ${biorep}`}
            </>
          );
        },
      },
    ],
    [scale]
  );

  return (
    <Table
      label={label}
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      apiRef={apiRef}
      disableColumnSorting={isPresorted}
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
