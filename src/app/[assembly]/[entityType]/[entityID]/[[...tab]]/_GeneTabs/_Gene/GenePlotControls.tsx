import React from "react";
import { Stack, FormControl, FormLabel, ToggleButtonGroup, ToggleButton, Tooltip, styled } from "@mui/material";

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  ...theme.typography.body2
}));

interface ControlProps {
  assembly: string;
  RNAtype: string;
  scale: string;
  viewBy: string;
  replicates: string;
  setRNAType: (newType: "all" | "polyA plus RNA-seq" | "total RNA-seq") => void;
  setScale: (newScale: "linearTPM" | "logTPM") => void;
  setViewBy: (newView: "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM") => void;
  setReplicates: (newReplicates: "mean" | "all") => void;
  setSortBy?: (sortBy: "median" | "max" | "tissue") => void;
  sortBy?: "median" | "max" | "tissue";
  setShowPoints?: (showPoints: boolean) => void;
  showPoints?: boolean;
  violin?: boolean;
  disabled?: boolean;
}

const GenePlotControls: React.FC<ControlProps> = ({
  assembly,
  RNAtype,
  scale,
  viewBy,
  replicates,
  setRNAType,
  setScale,
  setViewBy,
  setReplicates,
  setSortBy = () => {},
  sortBy = "median",
  setShowPoints = () => {},
  showPoints = true,
  violin = false,
  disabled = false,
}) => {
  return (
    <Stack direction="row" gap={2} mb={2} flexWrap="wrap">
      <FormControl>
        <StyledFormLabel>RNA-seq Type</StyledFormLabel>
        <ToggleButtonGroup
          color="primary"
          value={RNAtype}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              setRNAType(value as "all" | "polyA plus RNA-seq" | "total RNA-seq");
            }
          }}
          aria-label="RNA-seq Type"
          size="small"
        >
          <ToggleButton sx={{ textTransform: "none" }} value="total RNA-seq" disabled={disabled}>
            Total
          </ToggleButton>
          <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
            <div>
              <ToggleButton
                disabled={assembly === "GRCh38" || disabled}
                sx={{ textTransform: "none" }}
                value="polyA plus RNA-seq"
              >
                PolyA+
              </ToggleButton>
            </div>
          </Tooltip>
          <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
            <div>
              <ToggleButton disabled={assembly === "GRCh38" || disabled} sx={{ textTransform: "none" }} value="all">
                All
              </ToggleButton>
            </div>
          </Tooltip>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl>
        <StyledFormLabel>Scale</StyledFormLabel>
        <ToggleButtonGroup
          color="primary"
          value={scale}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              setScale(value as "linearTPM" | "logTPM");
            }
          }}
          aria-label="Scale"
          size="small"
          disabled={disabled}
        >
          <ToggleButton sx={{ textTransform: "none" }} value="linearTPM">
            Linear
          </ToggleButton>
          <ToggleButton sx={{ textTransform: "none" }} value="logTPM">
            Log
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <FormControl>
        <StyledFormLabel>Replicates</StyledFormLabel>
        <ToggleButtonGroup
          color="primary"
          value={replicates}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              setReplicates(value as "mean" | "all");
            }
          }}
          aria-label="Replicates"
          size="small"
          disabled={disabled}
        >
          <ToggleButton sx={{ textTransform: "none" }} value="mean">
            Average
          </ToggleButton>
          <ToggleButton sx={{ textTransform: "none" }} value="all">
            Show Replicates
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      {violin ? (
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
      ) : (
        <FormControl>
          <StyledFormLabel>View By</StyledFormLabel>
          <ToggleButtonGroup
            color="primary"
            value={viewBy}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setViewBy(value as "byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM");
              }
            }}
            aria-label="View By"
            size="small"
            disabled={disabled}
          >
            <ToggleButton sx={{ textTransform: "none" }} value="byExperimentTPM">
              Experiment
            </ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="byTissueTPM">
              Tissue
            </ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="byTissueMaxTPM">
              Tissue Max
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      )}
    </Stack>
  );
};

export default GenePlotControls;
