import React from "react";
import { Stack, FormControl, FormLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface Peak {
    peakID: string;
    peakType: string;
}

interface TranscriptPlotControlsProps {
    selectedPeak: string;
    setPeak: (peakID: string) => void;
    transcriptExpressionData: { peaks: Peak[] };
    scale: string;
    setScale: (scale: string) => void;
    viewBy: string;
    setViewBy: (view: string) => void;
    violin?: boolean;
    setSortBy?: (sortBy: "median" | "max" | "tissue") => void;
    sortBy?: "median" | "max" | "tissue";
    setShowPoints?: (showPoints: boolean) => void;
    showPoints?: boolean;
}

const TranscriptPlotControls: React.FC<TranscriptPlotControlsProps> = ({
    selectedPeak,
    setPeak,
    transcriptExpressionData,
    scale,
    setScale,
    viewBy,
    setViewBy,
    setSortBy = () => { },
    sortBy = "median",
    violin = false,
    setShowPoints = () => { },
    showPoints = true,
}) => (
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl>
            <FormLabel>Peak</FormLabel>
            <Select
                value={selectedPeak}
                onChange={(e) => setPeak(e.target.value as string)}
                size="small"
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
        <FormControl>
            <FormLabel>Scale</FormLabel>
            <ToggleButtonGroup
                color="primary"
                value={scale}
                exclusive
                onChange={(_event, value) => {
                    if (value !== null) {
                        setScale(value);
                    }
                }}
                aria-label="View By"
                size="small"
            >
                <ToggleButton sx={{ textTransform: "none" }} value="linear">
                    Linear
                </ToggleButton>
                <ToggleButton sx={{ textTransform: "none" }} value="log">
                    Log
                </ToggleButton>
            </ToggleButtonGroup>
        </FormControl>
        {!violin && (
            <FormControl>
                <FormLabel>View By</FormLabel>
                <ToggleButtonGroup
                    color="primary"
                    value={viewBy}
                    exclusive
                    onChange={(_event, value) => {
                        if (value !== null) {
                            setViewBy(value);
                        }
                    }}
                    aria-label="View By"
                    size="small"
                >
                    <ToggleButton sx={{ textTransform: "none" }} value="value">
                        Value
                    </ToggleButton>
                    <ToggleButton sx={{ textTransform: "none" }} value="tissue">
                        Tissue
                    </ToggleButton>
                    <ToggleButton sx={{ textTransform: "none" }} value="tissueMax">
                        Tissue Max
                    </ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
        )}
        {violin && (
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControl>
                    <FormLabel>Sort By</FormLabel>
                    <ToggleButtonGroup
                        color="primary"
                        value={sortBy}
                        exclusive
                        onChange={(_event, value) => {
                            if (value !== null) {
                                setSortBy(value);
                            }
                        }}
                        aria-label="View By"
                        size="small"
                    >
                        <ToggleButton sx={{ textTransform: "none" }} value="max">
                            Max
                        </ToggleButton>
                        <ToggleButton sx={{ textTransform: "none" }} value="median">
                            Median
                        </ToggleButton>
                        <ToggleButton sx={{ textTransform: "none" }} value="tissue">
                            Tissue
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Show Points</FormLabel>
                    <ToggleButtonGroup
                        color="primary"
                        value={showPoints}
                        exclusive
                        onChange={(_event, value) => {
                            if (value !== null) {
                                setShowPoints(value);
                            }
                        }}
                        aria-label="show points"
                        size="small"
                    >
                        <ToggleButton sx={{ textTransform: "none" }} value={true}>
                            On
                        </ToggleButton>
                        <ToggleButton sx={{ textTransform: "none" }} value={false}>
                            Off
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
            </Stack>
        )}
    </Stack>
);

export default TranscriptPlotControls;