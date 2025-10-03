import React from "react";
import { Stack, FormControl, FormLabel, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface AssayPlotControlsProps {
    viewBy: "value" | "tissue" | "tissueMax";
    setViewBy: (view: "value" | "tissue" | "tissueMax") => void;
    violin?: boolean;
    setSortBy?: (sortBy: "median" | "max" | "tissue") => void;
    sortBy?: "median" | "max" | "tissue";
    setShowPoints?: (showPoints: boolean) => void;
    showPoints?: boolean;
}

const AssayPlotControls: React.FC<AssayPlotControlsProps> = ({
    viewBy,
    setViewBy,
    setSortBy = () => { },
    sortBy = "median",
    violin = false,
    setShowPoints = () => { },
    showPoints = true,
}) => (
    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        {!violin && (
            <FormControl>
                <FormLabel>View By</FormLabel>
                <ToggleButtonGroup
                    color="primary"
                    value={viewBy}
                    exclusive
                    onChange={(_event, value) => {
                        if (value !== null) {
                            setViewBy(value as "value" | "tissue" | "tissueMax");
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
                                setSortBy(value as "median" | "max" | "tissue");
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

export default AssayPlotControls;