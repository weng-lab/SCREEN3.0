import React from "react";
import { Stack, FormControl, Select, MenuItem, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import { StyledFormLabel, ViolinPlotControls, ViolinSortBy } from "common/components/plotControls";

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
  setSortBy?: (sortBy: ViolinSortBy) => void;
  sortBy?: ViolinSortBy;
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
  setSortBy = () => {},
  sortBy = "median",
  violin = false,
  setShowPoints = () => {},
  showPoints = true,
}) => (
  <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
    <FormControl>
      <StyledFormLabel>Peak</StyledFormLabel>
      <Select
        value={selectedPeak}
        onChange={(e) => setPeak(e.target.value as string)}
        size="small"
        renderValue={(value) => transcriptExpressionData?.peaks.find((p) => p.peakID === value)?.peakID || ""}
      >
        {transcriptExpressionData?.peaks.map((peak) => (
          <MenuItem key={peak.peakID} value={peak.peakID}>
            {`${peak.peakID} (${peak.peakType})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl>
      <StyledFormLabel>Scale</StyledFormLabel>
      <ToggleButtonGroup
        color="primary"
        value={scale}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setScale(value);
          }
        }}
        aria-label="Scale"
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
        <StyledFormLabel>View By</StyledFormLabel>
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
  </Stack>
);

export default TranscriptPlotControls;
