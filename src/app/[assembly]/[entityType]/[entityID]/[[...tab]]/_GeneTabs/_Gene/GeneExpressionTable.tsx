import { GeneExpressionTableProps, getScaledTPM, PointMetadata } from "./types";
import { IconButton } from "@mui/material";
import { TableColDef, Table, useSyncedTable } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useMemo } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";

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
  const columns: TableColDef<PointMetadata>[] = useMemo(
    () => [
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

  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted });

  return (
    <Table
      {...syncedTableProps}
      divHeight={{ height: "100%" }}
      label={label}
      rows={rows}
      loading={loading}
      error={error}
    />
  );
};

export default GeneExpressionTable;
