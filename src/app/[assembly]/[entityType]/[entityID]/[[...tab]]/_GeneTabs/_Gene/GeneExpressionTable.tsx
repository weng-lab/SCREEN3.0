import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { Box, FormControlLabel, IconButton, Switch, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import {
  gridFilteredSortedRowEntriesSelector,
  GridRowSelectionModel,
  useGridApiRef,
  GridColDef,
  Table,
  GRID_CHECKBOX_SELECTION_COL_DEF
} from "@weng-lab/ui-components";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { OpenInNew, Sort } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility"

export type GeneExpressionTableProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps

const GeneExpressionTable = ({
  geneData,
  rows,
  selected,
  setSelected,
  geneExpressionData,
  setSortedFilteredData,
  sortedFilteredData,
  viewBy,
}: GeneExpressionTableProps) => {
  const [autoSort, setAutoSort] = useState<boolean>(false)
  const { data, loading, error } = geneExpressionData;
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  // based on control buttons in parent, transform this data to match the expected format
  const transformedData: PointMetadata[] = useMemo(() => {
    if (!rows.length) return [];
    const getTissue = (d: PointMetadata) => d.tissue ?? "unknown";
    const getTPM = (d: PointMetadata) =>
      d.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0;

    let result = rows;

    // Sort based on viewBy
    switch (viewBy) {
      case "byExperimentTPM": {
        result.sort((a, b) =>
          (getTPM(b)) -
          (getTPM(a))
        );
        break;
      }

      case "byTissueTPM": {
        const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
          const tissue = getTissue(item);
          acc[tissue] = Math.max(acc[tissue] ?? -Infinity, getTPM(item));
          return acc;
        }, {});

        result.sort((a, b) => {
          const tissueA = getTissue(a);
          const tissueB = getTissue(b);
          const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
          if (maxDiff !== 0) return maxDiff;
          return getTPM(b) - getTPM(a);
        })
        break;
      }

      case "byTissueMaxTPM": {

        const maxValuesByTissue: Record<string, number> = result.reduce((acc, item) => {
          const tissue = getTissue(item);
          const tpm = getTPM(item);
          acc[tissue] = Math.max(acc[tissue] || -Infinity, tpm);
          return acc;
        }, {} as Record<string, number>);

        result = result.filter((item) => {
          const tpm = getTPM(item);
          const tissue = getTissue(item);
          return tpm === maxValuesByTissue[tissue];
        });

        result.sort((a, b) => getTPM(b) - getTPM(a));
        break;
      }
    }
    return [...result];
  }, [rows, viewBy]);

  //This is used to prevent sorting from happening when clicking on the header checkbox
  const StopPropagationWrapper = (params) => (
    <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
      <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    </div>
  );

  const columns: GridColDef<PointMetadata>[] = [
    {
      ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<PointMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
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
      field: "tpm" as any, //Workaround for typing issue -- find better solution
      headerName: "TPM",
      type: "number",
      valueGetter: (_, row) => {
        return (row.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm).toFixed(2) ?? 0;
      },
      sortable: viewBy !== "byTissueTPM",
    },
    {
      field: "tissue",
      headerName: "Tissue",
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
        return (row.accession.split(" ")[0])
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

  const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
    const newIds = Array.from(ids.ids);
    const selectedRows = newIds.map((id) => transformedData.find((row) => row.gene_quantification_files[0].accession === id));
    setSelected(selectedRows);
  };

  const apiRef = useGridApiRef();

  const arraysAreEqual = (arr1: PointMetadata[], arr2: PointMetadata[]): boolean => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const isEqual = JSON.stringify(arr1[0]) === JSON.stringify(arr2[0]);
    if (!isEqual) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].accession !== arr2[i].accession) {
        return false;
      }
    }
    return true;
  };

  const handleSync = () => {
    const syncrows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as PointMetadata[];
    if (!arraysAreEqual(sortedFilteredData, syncrows)) {
      setSortedFilteredData(syncrows);
    }
  };

  const AutoSortSwitch = useMemo(() => {
    return (
      <Tooltip title="Auto sort selected rows">
        <FormControlLabel
          value="autoSort"
          control={<Switch color="primary" size="small" sx={{ mr: 1 }} checked={autoSort} onChange={(_, checked) => setAutoSort(checked)} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center", lineHeight: 1 }}>
              <Sort fontSize="small" />
            </Box>
          }
          labelPlacement="start"
        />
      </Tooltip>
    )
  }, [autoSort])

  // handle auto sorting 
  useEffect(() => {
    const api = apiRef?.current;
    if (!api) return;

    const hasSelection = selected?.length > 0;

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
      //reset sort if none selected
      api.setSortModel([{ field: "tpm", sort: "desc" }]);
      return;
    }

    //sort by checkboxes if some selected, otherwise sort by tpm
    api.setSortModel([{ field: hasSelection ? "__check__" : "tpm", sort: "desc" }]);
  }, [apiRef, autoSort, selected, viewBy]);


  return (
    <>
      <Table
        apiRef={apiRef}
        label={`${geneData?.data.name} Expression`}
        density="standard"
        rows={transformedData}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          sorting: {
            sortModel: [{ field: "tpm", sort: "desc" }],
          },
        }}
        // -- Selection Props --
        checkboxSelection
        getRowId={(row) => row.gene_quantification_files[0].accession} //needed to match up data with the ids returned by onRowSelectionModelChange
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.gene_quantification_files[0].accession)) }}
        keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
        // -- End Selection Props --
        onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
        divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
        toolbarSlot={AutoSortSwitch}
      />
    </>
  );
};

export default GeneExpressionTable;
