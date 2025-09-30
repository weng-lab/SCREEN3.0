import { FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";
import {
    gridFilteredSortedRowEntriesSelector,
    GridRowSelectionModel,
    useGridApiRef,
    GridColDef,
    Table
} from "@weng-lab/ui-components";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import React from "react";
import { OpenInNew } from "@mui/icons-material";
import { capitalizeFirstLetter } from "common/utility"
import { SharedTranscriptExpressionPlotProps, TranscriptExpressionProps, TranscriptMetadata } from "./TranscriptExpression";

export type TranscriptExpressionTableProps = TranscriptExpressionProps &
    SharedTranscriptExpressionPlotProps & {
        onSelectionChange: (selected: TranscriptMetadata[]) => void;
        setSortedFilteredData: Dispatch<SetStateAction<TranscriptMetadata[]>>;
    };

const TranscriptExpressionTable = ({
    selected,
    onSelectionChange,
    transcriptExpressionData,
    setSortedFilteredData,
    sortedFilteredData,
    handlePeakChange,
    selectedPeak
}: TranscriptExpressionTableProps) => {
    const [viewBy, setViewBy] = useState<"value" | "tissue" | "tissueMax">("value")
    const { data, loading, error } = transcriptExpressionData;

    const onPeakChange = (newPeak: string) => {
        handlePeakChange(newPeak);
    };

    const handleViewChange = (newView: "value" | "tissue" | "tissueMax") => {
        setViewBy(newView);
    }

    // based on control buttons, transform this data to match the expected format
    const transformedData: TranscriptMetadata[] = useMemo(() => {
        if (!data?.length) return [];

        let filteredData = data.filter(d => d.peakId === selectedPeak)

        // Sort based on viewBy
        switch (viewBy) {
            case "value": {
                filteredData.sort((a, b) =>
                    (b.value ?? 0) -
                    (a.value ?? 0)
                );
                break;
            }

            case "tissue": {
                const getTPM = (d: TranscriptMetadata) =>
                    d.value ?? 0;
                const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";

                const maxValuesByTissue: Record<string, number> = filteredData.reduce((acc, item) => {
                    const tissue = getTissue(item);
                    const tpm = getTPM(item);
                    acc[tissue] = Math.max(acc[tissue] || -Infinity, tpm);
                    return acc;
                }, {} as Record<string, number>);

                filteredData.sort((a, b) => {
                    const tissueA = getTissue(a);
                    const tissueB = getTissue(b);
                    const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
                    if (maxDiff !== 0) return maxDiff;
                    return getTPM(b) - getTPM(a);
                });
                break;
            }

            case "tissueMax": {
                const getTPM = (d: TranscriptMetadata) =>
                    d.value ?? 0;
                const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";

                const maxValuesByTissue: Record<string, number> = filteredData.reduce((acc, item) => {
                    const tissue = getTissue(item);
                    const tpm = getTPM(item);
                    acc[tissue] = Math.max(acc[tissue] || -Infinity, tpm);
                    return acc;
                }, {} as Record<string, number>);

                filteredData = filteredData.filter((item) => {
                    const tpm = getTPM(item);
                    const tissue = getTissue(item);
                    return tpm === maxValuesByTissue[tissue];
                });

                filteredData.sort((a, b) => getTPM(b) - getTPM(a));
                break;
            }
        }

        return filteredData;
    }, [data, selectedPeak, viewBy]);

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
            headerName: "RPM",
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
        const selectedRows = newIds.map((id) => transformedData.find((row) => row.expAccession === id));
        onSelectionChange(selectedRows);
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
        const rows = gridFilteredSortedRowEntriesSelector(apiRef).map((x) => x.model) as TranscriptMetadata[];
        if (!arraysAreEqual(sortedFilteredData, rows)) {
            setSortedFilteredData(rows);
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
                label={
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <Typography>Expression at</Typography>
                        <Select
                            value={selectedPeak}
                            onChange={(e) => onPeakChange(e.target.value)}
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
                    </Stack>
                }
                downloadFileName="transcript_expression"
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
                divHeight={{ height: "100%", minHeight: "580px", maxHeight: "600px" }}
                toolbarSlot={
                    <FormControl size="small">
                        <InputLabel id="view-by-label">View By</InputLabel>
                        <Select
                            labelId="view-by-label"
                            value={viewBy}
                            onChange={(e) => handleViewChange(e.target.value)}
                            label="View By"
                            size="small"
                            sx={{ height: 32 }}
                        >
                            <MenuItem value="value">Value</MenuItem>
                            <MenuItem value="tissue">Tissue</MenuItem>
                            <MenuItem value="tissueMax">Tissue Max</MenuItem>
                        </Select>
                    </FormControl>
                }
            />
        </>
    );
};

export default TranscriptExpressionTable;
