import { FormControl, IconButton, MenuItem, Select, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
    gridFilteredSortedRowEntriesSelector,
    GridRowSelectionModel,
    useGridApiRef,
    GridColDef,
    Table,
    GRID_CHECKBOX_SELECTION_COL_DEF,
    GridSortDirection,
    GridSortModel
} from "@weng-lab/ui-components";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility"
import { SharedTranscriptExpressionPlotProps, TranscriptExpressionProps, TranscriptMetadata } from "./TranscriptExpression";
import AutoSortSwitch from "common/components/AutoSortSwitch";

export type TranscriptExpressionTableProps = TranscriptExpressionProps &
    SharedTranscriptExpressionPlotProps

const TranscriptExpressionTable = ({
    selected,
    setSelected,
    transcriptExpressionData,
    setSortedFilteredData,
    sortedFilteredData,
    selectedPeak,
    setPeak,
    viewBy,
    rows,
    scale
}: TranscriptExpressionTableProps) => {
    const [autoSort, setAutoSort] = useState<boolean>(false);
    const { data, loading, error } = transcriptExpressionData;
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
    const StopPropagationWrapper = (params) => (
        <div id={"StopPropagationWrapper"} onClick={(e) => e.stopPropagation()}>
            <GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader {...params} />
        </div>
    );

    const columns: GridColDef<TranscriptMetadata>[] = [
        {
            ...(GRID_CHECKBOX_SELECTION_COL_DEF as GridColDef<TranscriptMetadata>), //Override checkbox column https://mui.com/x/react-data-grid/row-selection/#custom-checkbox-column
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

    const AutoSortToolbar = useMemo(() => {
        return (
            <AutoSortSwitch autoSort={autoSort} setAutoSort={setAutoSort} />
        )
    }, [autoSort])

    const initialSort: GridSortModel = useMemo(() =>
        [{ field: "rpm", sort: "desc" as GridSortDirection }],
        []);

    // handle auto sorting 
    useEffect(() => {
        const api = apiRef?.current;
        if (!api) return;

        const hasSelection = selected?.length > 0;

        // handle sort by tissue special case
        if (viewBy === "tissue") {
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
            api.setSortModel(initialSort);
            return;
        }

        //sort by checkboxes if some selected, otherwise sort by tpm
        api.setSortModel(hasSelection ? [{ field: "__check__", sort: "desc" }] : initialSort);
    }, [apiRef, autoSort, initialSort, selected, viewBy]);

    return (
        <>
            <Table
                apiRef={apiRef}
                label={
                    <>
                        <Typography mr={1} display={{xs: "none", md: "inherit"}}>TSS Expression at</Typography>
                        <FormControl>
                            <Select
                                value={selectedPeak}
                                onChange={(e) => setPeak(e.target.value as string)}
                                size="small"
                                variant="standard"
                                renderValue={(value) =>
                                    transcriptExpressionData?.peaks.find((p) => p.peakID === value)?.peakID || ""
                                }
                            >
                                {transcriptExpressionData?.peaks.map((peak) => (
                                    <MenuItem key={peak.peakID} value={peak.peakID}>
                                        {`${peak.peakID} (${peak.peakType})`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                }
                rows={transformedData}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                    sorting: {
                        sortModel: initialSort,
                    },
                }}
                downloadFileName={"TSS Expression at " + selectedPeak}
                // -- Selection Props --
                checkboxSelection
                getRowId={(row) => row.expAccession} //needed to match up data with the ids returned by onRowSelectionModelChange
                onRowSelectionModelChange={handleRowSelectionModelChange}
                rowSelectionModel={{ type: 'include', ids: new Set(selected.map((x) => x.expAccession)) }}
                keepNonExistentRowsSelected // Needed to prevent clearing selections on changing filters
                // -- End Selection Props --
                onStateChange={handleSync} // Not really supposed to be using this, is not documented by MUI. Not using its structure, just the callback trigger
                divHeight={{ height: "100%", minHeight: isXs ? "none" : "580px" }}
                toolbarSlot={AutoSortToolbar}
            />
        </>
    );
};

export default TranscriptExpressionTable;
