import { FormControl, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { StyledFormLabel } from "./StyledFormLabel";

export type ViolinSortBy = "median" | "max" | "tissue";

interface ViolinPlotControlsProps {
  sortBy: ViolinSortBy;
  setSortBy: (sortBy: ViolinSortBy) => void;
  showPoints: boolean;
  setShowPoints: (showPoints: boolean) => void;
}

/** Violin-only controls, shared by AssayPlotControls, GenePlotControls and TranscriptPlotControls */
export const ViolinPlotControls = ({ sortBy, setSortBy, showPoints, setShowPoints }: ViolinPlotControlsProps) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <FormControl>
      <StyledFormLabel>Sort By</StyledFormLabel>
      <ToggleButtonGroup
        color="primary"
        value={sortBy}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setSortBy(value);
          }
        }}
        aria-label="Sort By"
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
      <StyledFormLabel>Show Points</StyledFormLabel>
      <ToggleButtonGroup
        color="primary"
        value={showPoints}
        exclusive
        onChange={(_event, value) => {
          if (value !== null) {
            setShowPoints(value);
          }
        }}
        aria-label="Show Points"
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
