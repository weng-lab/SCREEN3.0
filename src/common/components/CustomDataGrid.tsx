import { Box, Paper, PaperProps, Tooltip, TooltipProps, Typography } from "@mui/material";
import { DataGridPro, DataGridProProps, GridAutosizeOptions, GridColDef, useGridApiRef } from "@mui/x-data-grid-pro";
import CustomDataGridToolbar, { CustomDataGridToolbarProps } from "./dataGridToolbar";
import { useMemo, useEffect, useCallback, ReactElement } from "react";
import { InfoOutlined } from "@mui/icons-material";
import EmptyTableFallback from "./EmptyTableFallback";

export type CustomDataGridRow = Record<string, any>;

export type CustomDataGridSlotProps = DataGridProProps["slotProps"] & {
  /**
   * The wrapper around the DataGrid which provides the box shadow
   */
  paper?: PaperProps;
};

//The props listed here are the props which are new (like elevation) or overridden (like pageSizeOptions) compared to the MUI DataGridProProps

export interface CustomDataGridProps<T extends CustomDataGridRow> extends DataGridProProps {
  /**
   * A set of columns of type `CustomDataGridColDef<Row>`, where `Row` is of type `CustomDataGridRow`
   */
  columns: CustomDataGridColDef<T>[];
  /**
   * Rows to be consumed in the table.
   * ```undefined``` will be given default value of ```[]```
   */
  rows: T[];
  /**
   * Optional ReactNode to be used in the table toolbar. Strings and numbers will be rendered as Typography variant h6.
   */
  tableTitle?: CustomDataGridToolbarProps["title"];
  /**
   * Elevation for wrapper `Paper` element
   * @default 1
   */
  elevation?: PaperProps["elevation"];
  /**
   * Optional prop overrides for the underlying components
   */
  slotProps?: CustomDataGridSlotProps;
  /**
   * @default [5, 10, 25, 100]
   * @note Overrides MUI default, first option automatically selected as initial page size (below), so setting in initialState is not necessary
   * ```jsx
   * initialState={{
   *   pagination: {
   *     paginationModel: {
   *       pageSize: typeof pageSizeOptions[0] === "object" ? pageSizeOptions[0].value : pageSizeOptions[0],
   *     },
   *   },
   *   ...initialState
   * }}
   * ```
   */
  pageSizeOptions?: DataGridProProps["pageSizeOptions"];
  /**
   * @default true
   */
  pagination?: DataGridProProps["pagination"];
  /**
   * @default true
   * @note Overrides MUI default
   */
  disableRowSelectionOnClick?: DataGridProProps["disableRowSelectionOnClick"];
  /**
   * @default "compact"
   * @note Overrides MUI default
   */
  density?: DataGridProProps["density"];
  /**
   * @default true
   * @note Overrides MUI default
   */
  autosizeOnMount?: boolean;
  /**
   * @note CustomDataGrid assigns a default internal ID to each row if no ID is provided in the row data.
   */
  getRowId?: DataGridProProps["getRowId"];
  /**
   * Element to be rendered instead of `DataGridPro` when `rows` has a length of `0`.
   * If a string is passed will use `EmptyTableFallback` component
   */
  emptyTableFallback?: string | ReactElement;
}

export type CustomDataGridColDef<T extends CustomDataGridRow> = GridColDef & {
  /**
   * Attribute of the row object to be used for the column
   */
  field: keyof T;
  /**
   * Optional tooltip to be displayed with info icon in column header
   */
  tooltip?: TooltipProps["title"];
};

const CustomDataGrid = <T extends CustomDataGridRow>(props: CustomDataGridProps<T>) => {
  /**
   * Provide defaults
   * @todo obey the defaults specified in the theme.
   * Ex: Overriding pageSizeOptions like this overrides the defaults specified in the theme
   */
  const {
    elevation, // don't provide elevation default so that it's default obeys the MUI theme
    tableTitle,
    slots,
    slotProps = {},
    pageSizeOptions = [5, 10, 25, 100],
    pagination = true,
    columns,
    density = "compact",
    rows = [],
    initialState,
    apiRef: externalApiRef,
    onPaginationModelChange,
    onResize,
    emptyTableFallback,
    ...restDataGridProps
  } = props;
  const { paper: paperProps, ...restSlotProps } = slotProps;

  //Assign default ID if no ID is provided in the row data
  const rowsWithIds = useMemo(() => rows.map((row, index) => ({ ...row, id: row?.id || index })), [rows]);

  const columnsModified: CustomDataGridColDef<T>[] = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        renderHeader: col.tooltip
          ? (params) => {
              return (
                <Tooltip title={col.tooltip}>
                  <Box display="inline-flex" alignItems="center">
                    {col.renderHeader ? (
                      <col.renderHeader {...params} /> // use renderHeader if specified
                    ) : (
                      <Typography variant="inherit">{col?.headerName ?? col.field}</Typography> // fallback to headerName and then field
                    )}
                    <InfoOutlined sx={{ fontSize: "inherit", marginLeft: 0.5 }} />
                  </Box>
                </Tooltip>
              );
            }
          : col.renderHeader,
      })),
    [columns]
  );

  const autosizeOptions: GridAutosizeOptions = useMemo(
    () => ({
      expand: true,
      includeHeaders: true,
      outliersFactor: 1.5,
    }),
    []
  );

  const internalApiRef = useGridApiRef();
  // prioritize using the provided apiRef if available, otherwise create a new one
  const apiRef = externalApiRef ?? internalApiRef;

  const handleResizeCols = useCallback(() => {
    // need to check .autosizeCoumns since the current was being set with an empty object
    if (!apiRef.current?.autosizeColumns) return;
    apiRef.current.autosizeColumns(autosizeOptions);
  }, [apiRef, autosizeOptions]);

  // trigger resize when rows or columns change so that rows/columns don't need to be memoized outisde of this component
  // otherwise sometimes would snap back to default widths when rows/columns change
  useEffect(() => {
    handleResizeCols();
  }, [rows, columns, handleResizeCols]);

  return emptyTableFallback && rowsWithIds.length === 0 && !restDataGridProps.loading  ? (
    typeof emptyTableFallback === "string" ? (
      <EmptyTableFallback message={emptyTableFallback} />
    ) : (
      emptyTableFallback
    )
  ) : (
    <Paper sx={{ display: "flex" }} elevation={elevation} {...paperProps}>
      <DataGridPro
        apiRef={apiRef}
        columns={columnsModified}
        autosizeOnMount
        onPaginationModelChange={(model, details) => {
          if (onPaginationModelChange) {
            onPaginationModelChange(model, details);
          }
          handleResizeCols();
        }}
        onResize={(params, event, details) => {
          if (onResize) {
            onResize(params, event, details);
          }
          handleResizeCols();
        }}
        autosizeOptions={autosizeOptions}
        rows={rowsWithIds}
        disableRowSelectionOnClick
        slots={{ toolbar: () => <CustomDataGridToolbar title={tableTitle} />, ...slots }}
        density={density}
        slotProps={{ ...restSlotProps }} //https://v6.mui.com/material-ui/guides/composition/#forwarding-slot-props
        pagination
        pageSizeOptions={pageSizeOptions}
        // set initial rows per page to first page size option. Page sizes can be array of numbers or objects with value/label
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: typeof pageSizeOptions[0] === "object" ? pageSizeOptions[0].value : pageSizeOptions[0],
            },
          },
          ...initialState,
        }}
        {...restDataGridProps}
      />
    </Paper>
  );
};

export default CustomDataGrid;
