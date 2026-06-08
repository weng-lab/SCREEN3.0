import { Box, Paper } from "@mui/material";
import {
  DataGridPremium,
  FilterColumnsArgs,
  GridAutosizeOptions,
  GridColDef,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridRowId,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGridProps } from "../types";
import { DefaultGroupingCell } from "./DefaultGroupingCell";

const autosizeOptions: GridAutosizeOptions = {
  expand: true,
  includeHeaders: true,
  outliersFactor: 1.5,
};

const areSetsEqual = <T,>(a: Set<T>, b: Set<T>) => {
  if (a.size !== b.size) {
    return false;
  }

  for (const value of a) {
    if (!b.has(value)) {
      return false;
    }
  }

  return true;
};

const areSelectionModelsEqual = (
  a: GridRowSelectionModel,
  b: GridRowSelectionModel,
) => a.type === b.type && areSetsEqual(a.ids, b.ids);

export function DataGridWrapper(props: DataGridProps) {
  const {
    columns,
    groupingModel,
    leafField,
    onSelectionChange,
    rows,
    selectedIds,
    GroupingCellComponent,
  } = props;

  const GroupingCell = GroupingCellComponent ?? DefaultGroupingCell;

  const apiRef = useGridApiRef();

  const rowIdSet = useMemo(
    () => new Set(rows.map((row: { id: string }) => row.id)),
    [rows],
  );

  const filterToLeafIds = useCallback(
    (ids: Set<GridRowId>) =>
      new Set([...ids].map(String).filter((id) => rowIdSet.has(id))),
    [rowIdSet],
  );

  const getPropagatedSelectionModel = useCallback(
    (ids: Set<GridRowId>) => {
      const selectionModel: GridRowSelectionModel = {
        type: "include",
        ids,
      };

      return apiRef.current.getPropagatedRowSelectionModel
        ? apiRef.current.getPropagatedRowSelectionModel(selectionModel)
        : selectionModel;
    },
    [apiRef],
  );

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>(() => ({
      type: "include",
      ids: new Set(selectedIds),
    }));

  useEffect(() => {
    const currentLeafIds = filterToLeafIds(rowSelectionModel.ids);
    if (areSetsEqual(currentLeafIds, selectedIds)) {
      return;
    }

    const nextSelectionModel = getPropagatedSelectionModel(
      new Set(selectedIds),
    );

    setRowSelectionModel((currentSelectionModel) =>
      areSelectionModelsEqual(currentSelectionModel, nextSelectionModel)
        ? currentSelectionModel
        : nextSelectionModel,
    );
  }, [
    filterToLeafIds,
    getPropagatedSelectionModel,
    groupingModel,
    rowSelectionModel.ids,
    selectedIds,
  ]);

  useEffect(() => {
    if (apiRef.current && apiRef.current.autosizeColumns) {
      apiRef.current.autosizeColumns(autosizeOptions);
    }
  }, [columns, groupingModel, leafField]);

  const baseVisibility = useMemo(() => {
    const visibility: GridColumnVisibilityModel = {
      id: false,
    };

    // Only hide leafField if we have grouping (it shows in grouping column)
    if (groupingModel.length > 0) {
      visibility[leafField] = false;
    }

    groupingModel.forEach((field) => {
      visibility[field] = false;
    });

    return visibility;
  }, [groupingModel, leafField]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(baseVisibility);

  useEffect(() => {
    setColumnVisibilityModel(baseVisibility);
  }, [baseVisibility]);

  // functions to customize the column and filter panel in the toolbar
  const filterColumns = ({ columns }: FilterColumnsArgs) => {
    return columns
      .filter((column) => column.type !== "custom")
      .map((column) => column.field);
  };

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter((column) => column.type !== "custom")
      .map((column) => column.field);
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <Box
        sx={{
          height: 500,
          width: "100%",
          overflow: "auto",
        }}
      >
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          getRowId={(row: { id: string }) => row.id}
          autosizeOptions={autosizeOptions}
          rowGroupingModel={groupingModel}
          groupingColDef={{
            leafField,
            display: "flex",
            minWidth: 300,
            maxWidth: 500,
            flex: 2,
            renderCell: (params: GridRenderCellParams) => (
              <GroupingCell {...params} />
            ),
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          onRowSelectionModelChange={(selection: GridRowSelectionModel) => {
            const nextSelectionModel = getPropagatedSelectionModel(
              selection.ids,
            );

            setRowSelectionModel((currentSelectionModel) =>
              areSelectionModelsEqual(currentSelectionModel, nextSelectionModel)
                ? currentSelectionModel
                : nextSelectionModel,
            );

            const leafIds = filterToLeafIds(nextSelectionModel.ids);

            if (!areSetsEqual(leafIds, selectedIds)) {
              onSelectionChange(leafIds);
            }
          }}
          rowSelectionPropagation={{ descendants: true, parents: true }}
          disableRowGrouping={false}
          rowSelectionModel={rowSelectionModel}
          slotProps={{
            filterPanel: {
              filterFormProps: {
                filterColumns,
              },
            },
            columnsManagement: {
              getTogglableColumns,
            },
          }}
          keepNonExistentRowsSelected
          showToolbar
          disableAggregation
          disableRowSelectionExcludeModel
          disablePivoting
          checkboxSelection
          autosizeOnMount
          pagination
          hideFooterSelectedRowCount
        />
      </Box>
    </Paper>
  );
}
