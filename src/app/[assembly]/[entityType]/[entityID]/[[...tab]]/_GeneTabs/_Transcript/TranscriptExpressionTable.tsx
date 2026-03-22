import { FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { TableColDef, Table, useSyncedTable } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useMemo } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import { getScaledRPM } from "./types";
import type { TranscriptMetadata, TranscriptExpressionTableProps } from "./types";

const initialSort: GridSortModel = [{ field: " ", sort: "desc" }];

const TranscriptExpressionTable = ({
  rows,
  transcriptExpressionData,
  tableProps,
  isPresorted,
  scale,
  selectedPeak,
  setPeak,
}: TranscriptExpressionTableProps) => {
  const { loading } = transcriptExpressionData;

  const columns: TableColDef<TranscriptMetadata>[] = useMemo(
    () => [
      {
        field: "biosample",
        headerName: "Sample",
        valueGetter: (_, row) => {
          return capitalizeFirstLetter(row.biosampleSummary.replaceAll("_", " "));
        },
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
        headerName: scale === "linear" ? "RPM" : "Log10(RPM + 1)",
        type: "number",
        valueGetter: (_, row) => {
          return getScaledRPM(row, scale).toFixed(2);
        },
      },
      {
        field: "organ",
        headerName: "Tissue",
        valueGetter: (_, row) => {
          return capitalizeFirstLetter(row.organ);
        },
      },
      {
        field: "strand",
        headerName: "Strand",
      },
      {
        field: "expAccession",
        headerName: "Experiment",
        renderCell: (params) => (
          <Tooltip title="View Experiment in ENCODE" arrow>
            <IconButton
              href={`https://www.encodeproject.org/experiments/${params.value}`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              <OpenInNew fontSize="inherit" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [scale]
  );

  const { syncedTableProps } = useSyncedTable({ tableProps, columns, initialSort, isPresorted });

  const TableLabel = useMemo(
    () => (
      <>
        <Typography mr={1} display={{ xs: "none", md: "inherit" }}>
          TSS Expression at
        </Typography>
        <FormControl>
          <Select
            value={selectedPeak}
            onChange={(e) => setPeak(e.target.value as string)}
            size="small"
            variant="standard"
            renderValue={(value) => transcriptExpressionData?.peaks.find((p) => p.peakID === value)?.peakID || ""}
          >
            {transcriptExpressionData?.peaks.map((peak) => (
              <MenuItem key={peak.peakID} value={peak.peakID}>
                {`${peak.peakID} (${peak.peakType})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    ),
    [selectedPeak, setPeak, transcriptExpressionData]
  );

  return (
    <Table
      {...syncedTableProps}
      label={TableLabel}
      rows={rows}
      loading={loading}
      downloadFileName={"TSS Expression at " + selectedPeak}
    />
  );
};

export default TranscriptExpressionTable;
