import React from "react";
import { Stack, FormControl, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import type { ViewBy } from "./types";
import { StyledFormLabel, ViolinPlotControls, ViolinSortBy } from "common/components/plotControls";

interface AssayPlotControlsProps {
  viewBy: ViewBy;
  setViewBy: (view: ViewBy) => void;
  violin?: boolean;
  setSortBy?: (sortBy: ViolinSortBy) => void;
  sortBy?: ViolinSortBy;
  setShowPoints?: (showPoints: boolean) => void;
  showPoints?: boolean;
  cutoffLowSignal?: boolean;
  setCutoffLowSignal?: (cutoff: boolean) => void;
  show95Line?: boolean;
  setShow95Line?: (show: boolean) => void;
}

const AssayPlotControls: React.FC<AssayPlotControlsProps> = ({
  viewBy,
  setViewBy,
  setSortBy = () => {},
  sortBy = "median",
  violin = false,
  setShowPoints = () => {},
  showPoints = true,
  cutoffLowSignal = true,
  setCutoffLowSignal = () => {},
  show95Line = true,
  setShow95Line = () => {},
}) => (
  <Stack direction="row" gap={2} mb={2} flexWrap="wrap">
    {!violin && (
      <FormControl>
        <StyledFormLabel>View By</StyledFormLabel>
        <ToggleButtonGroup
          color="primary"
          value={viewBy}
          exclusive
          onChange={(_event, value) => {
            if (value !== null) {
              setViewBy(value as ViewBy);
            }
          }}
          aria-label="View By"
          size="small"
        >
          <ToggleButton sx={{ textTransform: "none" }} value="value">
            Value
          </ToggleButton>
          <Tooltip title="Disables sorting in table">
            <ToggleButton sx={{ textTransform: "none" }} value="tissue">
              Tissue
            </ToggleButton>
          </Tooltip>
          <ToggleButton sx={{ textTransform: "none" }} value="tissueMax">
            Tissue Max
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    )}
    {violin && (
      <ViolinPlotControls sortBy={sortBy} setSortBy={setSortBy} showPoints={showPoints} setShowPoints={setShowPoints} />
    )}
    <FormControl>
      <StyledFormLabel>Hide Low Z-Scores</StyledFormLabel>
      <ToggleButtonGroup
        color="primary"
        value={cutoffLowSignal}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setCutoffLowSignal(value);
          }
        }}
        aria-label="Hide Low Z-Scores"
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
    <FormControl>
      <StyledFormLabel>95th Percentile Line (1.64)</StyledFormLabel>
      <ToggleButtonGroup
        color="primary"
        value={show95Line}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setShow95Line(value);
          }
        }}
        aria-label="95th Percentile Line"
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
);

export default AssayPlotControls;
