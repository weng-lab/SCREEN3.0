import React from "react";
import { Stack, FormControl, FormLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface Peak {
    peakID: string;
    peakType: string;
}

interface TranscriptPlotControlsProps {
    selectedPeak: string;
    handlePeakChange: (peakID: string) => void;
    transcriptExpressionData: { peaks: Peak[] };
    scale: string;
    handleScaleChange: (scale: string) => void;
    viewBy: string;
    handleViewChange: (view: string) => void;
}

const TranscriptPlotControls: React.FC<TranscriptPlotControlsProps> = ({
    selectedPeak,
    handlePeakChange,
    transcriptExpressionData,
    scale,
    handleScaleChange,
    viewBy,
    handleViewChange,
}) => (
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <FormControl>
            <FormLabel>Peak</FormLabel>
            <Select
                value={selectedPeak}
                onChange={(e) => handlePeakChange(e.target.value as string)}
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
                        handleScaleChange(value);
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
        <FormControl>
            <FormLabel>View By</FormLabel>
            <ToggleButtonGroup
                color="primary"
                value={viewBy}
                exclusive
                onChange={(_event, value) => {
                    if (value !== null) {
                        handleViewChange(value);
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
    </Stack>
);

export default TranscriptPlotControls;