import { FormControl, IconButton, MenuItem, Select, Tooltip, Typography } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { useMemo } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import { sortableTableCheckboxColumn } from "common/components/SortableTableCheckboxColumn";
import { useAutoSort } from "common/hooks/useAutoSort";
import AutoSortSwitch from "common/components/AutoSortSwitch";
import { getScaledRPM } from "./types";
import type { TranscriptMetadata, TranscriptExpressionTableProps } from "./types";

const TranscriptExpressionTable = ({
  rows,
  transcriptExpressionData,
  tableProps,
  isPresorted,
  scale,
  selectedPeak,
  setPeak,
}: TranscriptExpressionTableProps) => {
  const { apiRef, onReady: tableSyncOnReady, ...restTableProps } = tableProps;
  const { loading } = transcriptExpressionData;

  const initialSort: GridSortModel = useMemo(() => [{ field: " ", sort: "desc" }], []);

  const { autoSort, setAutoSort, onReady: autoSortOnReady } = useAutoSort(apiRef, initialSort, isPresorted);

  const columns: TableColDef<TranscriptMetadata>[] = useMemo(
    () => [
      sortableTableCheckboxColumn,
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
      label={TableLabel}
      rows={rows}
      columns={columns}
      loading={loading}
      apiRef={apiRef}
      disableColumnSorting={isPresorted}
      initialState={{
        sorting: { sortModel: initialSort },
      }}
      divHeight={{ height: "100%" }}
      downloadFileName={"TSS Expression at " + selectedPeak}
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

export default TranscriptExpressionTable;
