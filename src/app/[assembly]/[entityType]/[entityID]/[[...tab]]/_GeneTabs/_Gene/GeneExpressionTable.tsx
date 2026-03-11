import { GeneExpressionTableProps, PointMetadata } from "./types";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import { TableColDef, Table } from "@weng-lab/ui-components";
import {
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridSortModel,
  GridSortDirection,
} from "@mui/x-data-grid-premium";
import { useEffect, useMemo, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility";
import AutoSortSwitch from "common/components/AutoSortSwitch";

const GeneExpressionTable = ({ rows, entity, geneExpressionData, tableProps, viewBy, scale }: GeneExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false);
  const { loading, error } = geneExpressionData;
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const { apiRef, rowSelectionModel } = tableProps;

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: TableColDef<PointMetadata>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as TableColDef<PointMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
      sortable: true,
      hideable: false,
      renderHeader: StopPropagationWrapper,
    },
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
        return (row.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0).toFixed(2);
      },
      sortable: viewBy !== "byTissueTPM",
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
          <IconButton href={`https://www.encodeproject.org/experiments/${params.value}/`} target="_blank" size="small">
            <OpenInNew fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const AutoSortToolbar = useMemo(() => {
    return <AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />;
  }, [autoSort]);

  const initialSort: GridSortModel = useMemo(() => [{ field: "tpm", sort: "desc" as GridSortDirection }], []);

  const hasSelection = rowSelectionModel.type === "include" && rowSelectionModel.ids.size > 0;

  // handle auto sorting
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    // handle sort by tissue special case
    if (viewBy === "byTissueTPM") {
      if (!autoSort || !hasSelection) {
        api.setSortModel([]); // clear when autoSort off OR no selection
      } else {
        api.setSortModel([{ field: "__check__", sort: "desc" }]);
      }
      return;
    }

    // all other views
    if (!autoSort) {
      api.setSortModel(initialSort);
      return;
    }

    //sort by checkboxes if some selected, otherwise sort by tpm
    api.setSortModel(hasSelection ? [{ field: "__check__", sort: "desc" }] : initialSort);
  }, [apiRef, autoSort, initialSort, hasSelection, viewBy]);

  return (
    <Table
      label={`${entity.entityID} Expression`}
      rows={rows}
      columns={columns}
      loading={loading}
      error={!!error}
      pageSizeOptions={[10, 25, 50]}
      getRowId={(row: PointMetadata) => row.accession}
      initialState={{
        sorting: {
          sortModel: initialSort,
        },
      }}
      divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
      toolbarSlot={AutoSortToolbar}
      {...tableProps}
    />
  );
};

export default GeneExpressionTable;
