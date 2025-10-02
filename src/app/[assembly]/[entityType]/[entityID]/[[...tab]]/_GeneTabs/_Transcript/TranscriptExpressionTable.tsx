import { IconButton, Tooltip } from "@mui/material";
import {
    gridFilteredSortedRowEntriesSelector,
    GridRowSelectionModel,
    useGridApiRef,
    GridColDef,
    Table
} from "@weng-lab/ui-components";
import { useEffect, useMemo } from "react";
import React from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility"
import { SharedTranscriptExpressionPlotProps, TranscriptExpressionProps, TranscriptMetadata } from "./TranscriptExpression";

export type TranscriptExpressionTableProps = TranscriptExpressionProps &
    SharedTranscriptExpressionPlotProps

const TranscriptExpressionTable = ({
    selected,
    setSelected,
    transcriptExpressionData,
    setSortedFilteredData,
    sortedFilteredData,
    selectedPeak,
    viewBy,
    rows,
    scale
}: TranscriptExpressionTableProps) => {
    const { data, loading, error } = transcriptExpressionData;

    const transformedData: TranscriptMetadata[] = useMemo(() => {
        if (!rows.length) return [];

        let filteredData = rows

        switch (viewBy) {
            case "value": {
                filteredData.sort((a, b) => b.value - a.value);
                break;
            }

            case "tissue": {
                const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";

                const maxValuesByTissue = filteredData.reduce<Record<string, number>>((acc, item) => {
                    const tissue = getTissue(item);
                    acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item.value);
                    return acc;
                }, {});

                filteredData.sort((a, b) => {
                    const tissueA = getTissue(a);
                    const tissueB = getTissue(b);
                    const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
                    if (maxDiff !== 0) return maxDiff;
                    return b.value - a.value;
                });
                break;
            }

            case "tissueMax": {
                const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";

                const maxValuesByTissue = filteredData.reduce<Record<string, number>>((acc, item) => {
                    const tissue = getTissue(item);
                    acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item.value);
                    return acc;
                }, {});

                filteredData = filteredData.filter((item) => {
                    const tissue = getTissue(item);
                    return item.value === maxValuesByTissue[tissue];
                });

                filteredData.sort((a, b) => b.value - a.value);
                break;
            }
        }

        return [...filteredData]
    }, [rows, viewBy]);


    //This is used to prevent sorting from happening when clicking on the header checkbox
    // const StopPropagationWrapper = (params) => (
    //   <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
    //     <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
    //   </div>
    // );

    const columns: GridColDef<TranscriptMetadata>[] = [
        // {
        //   ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<TranscriptMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
        //   sortable: true,
        //   hideable: false,
        //   renderHeader: StopPropagationWrapper,
        // },
        {
            field: "biosample",
            headerName: "Sample",
            sortable: viewBy !== "tissue",
            valueGetter: (_, row) => {
                return capitalizeFirstLetter(row.biosampleSummary.replaceAll("_", " "));
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
            field: "rpm" as any, //Workaround for typing issue -- find better solution
            headerName: `${scale === "log" ? "RPM(log10)" : "RPM"}`,
            type: "number",
            sortable: viewBy !== "tissue",
            valueGetter: (_, row) => {
                return (row.value.toFixed(2));
            },
        },
        {
            field: "organ",
            headerName: "Tissue",
            sortable: viewBy !== "tissue",
            valueGetter: (_, row) => {
                return capitalizeFirstLetter(row.organ);
            }
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
        }
    ];

    const handleRowSelectionModelChange = (ids: GridRowSelectionModel) => {
        const newIds = Array.from(ids.ids);
        const selectedRows = newIds.map((id) => rows.find((row) => row.expAccession === id));
        setSelected(selectedRows);
    };

    const apiRef = useGridApiRef();

    const arraysAreEqual = (arr1: TranscriptMetadata[], arr2: TranscriptMetadata[]): boolean => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        const isEqual = JSON.stringify(arr1[0]) === JSON.stringify(arr2[0]);
        if (!isEqual) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i].expAccession !== arr2[i].expAccession) {
                return false;
            }
        }
        return true;
    };

    const handleSync = () => {
        const syncrows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as TranscriptMetadata[];
        if (!arraysAreEqual(sortedFilteredData, syncrows)) {
            setSortedFilteredData(syncrows);
        }
    };

    useEffect(() => {
        const isCustomSorted = viewBy === "tissue";
        if (isCustomSorted && apiRef?.current) {
            apiRef.current.setSortModel([]); // completely clears internal sort
        }
    }, [viewBy, apiRef]);

    return (
        <>
            <Table
                apiRef={apiRef}
                label={"TSS Expression at " + selectedPeak}
                density="standard"
                rows={transformedData}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    sorting: {
                        sortModel: [{ field: "rpm", sort: "desc" }],
                    },
                }}
                // -- Selection Props --
                checkboxSelection
                getRowId={(row) => row.expAccession} //needed to match up data with the ids returned by onRowSelectionModelChange
                onRowSelectionModelChange={handleRowSelectionModelChange}
                rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.expAccession)) }}
                keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
                // -- End Selection Props --
                onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
                divHeight={{ height: "100%", minHeight: "580px" }}
            />
        </>
    );
};

export default TranscriptExpressionTable;
