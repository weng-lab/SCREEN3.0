import { FormControl, IconButton, MenuItem, Select, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import { GRID_CHECKBOX_SELECTION_COL_DEF, GridSortDirection, GridSortModel } from "@mui/x-data-grid-premium";
import { useEffect, useMemo, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import type { TranscriptMetadata, TranscriptExpressionTableProps } from "./types";
import AutoSortSwitch from "common/components/AutoSortSwitch";

const TranscriptExpressionTable = ({
  rows,
  transcriptExpressionData,
  tableProps,
  viewBy,
  scale,
  selectedPeak,
  setPeak,
}: TranscriptExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);
  const { loading } = transcriptExpressionData;
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: TableColDef<TranscriptMetadata>[] = useMemo(
    () => [
      {
        ...(GRID_CHECKBOX_SELECTION_COL_DEF as TableColDef<TranscriptMetadata>),
        sortable: true,
        hideable: false,
        renderHeader: StopPropagationWrapper,
      },
      {
        field: "biosample",
        headerName: "Sample",
        sortable: viewBy !== "tissue",
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
        headerName: `${scale === "linear" ? "RPM" : "Log10(RPM + 1)"}`,
        type: "number",
        sortable: viewBy !== "tissue",
        valueGetter: (_, row) => {
          return row.value.toFixed(2);
        },
      },
      {
        field: "organ",
        headerName: "Tissue",
        sortable: viewBy !== "tissue",
        valueGetter: (_, row) => {
          return capitalizeFirstLetter(row.organ);
        },
      },
      {
        field: "strand",
        headerName: "Strand",
        sortable: viewBy !== "tissue",
      },
      {
        field: "expAccession",
        headerName: "Experiment",
        sortable: viewBy !== "tissue",
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
    [viewBy, scale]
  );

  const AutoSortToolbar = useMemo(() => {
    return <AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />;
  }, [autoSort]);

  const { apiRef, rowSelectionModel } = tableProps;

  const initialSort: GridSortModel = useMemo(() => [{ field: "rpm", sort: "desc" as GridSortDirection }], []);

  const hasSelection = rowSelectionModel.type === "include" && rowSelectionModel.ids.size > 0;

  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    if (viewBy === "tissue") {
      if (!autoSort || !hasSelection) {
        api.setSortModel([]);
      } else {
        api.setSortModel([{ field: "__check__", sort: "desc" }]);
      }
      return;
    }

    if (!autoSort) {
      api.setSortModel(initialSort);
      return;
    }

    api.setSortModel(hasSelection ? [{ field: "__check__", sort: "desc" }] : initialSort);
  }, [apiRef, autoSort, initialSort, hasSelection, viewBy]);

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
      {...tableProps}
      label={TableLabel}
      rows={rows}
      columns={columns}
      loading={loading}
      initialState={{
        sorting: {
          sortModel: initialSort,
        },
      }}
      downloadFileName={"TSS Expression at " + selectedPeak}
      divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
      toolbarSlot={AutoSortToolbar}
    />
  );
};

export default TranscriptExpressionTable;
