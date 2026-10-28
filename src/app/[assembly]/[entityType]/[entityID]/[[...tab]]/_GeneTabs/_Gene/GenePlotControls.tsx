import React from "react";
import { Stack, FormControl, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import type {
  GeneExpressionRNAType,
  GeneExpressionScale,
  GeneExpressionViewBy,
  GeneExpressionReplicates,
} from "./types";
import { StyledFormLabel, ViolinPlotControls, ViolinSortBy } from "common/components/plotControls";

interface ControlProps {
  assembly: string;
  RNAtype: GeneExpressionRNAType;
  scale: GeneExpressionScale;
  viewBy: GeneExpressionViewBy;
  replicates: GeneExpressionReplicates;
  setRNAType: (newType: GeneExpressionRNAType) => void;
  setScale: (newScale: GeneExpressionScale) => void;
  setViewBy: (newView: GeneExpressionViewBy) => void;
  setReplicates: (newReplicates: GeneExpressionReplicates) => void;
  setSortBy?: (sortBy: ViolinSortBy) => void;
  sortBy?: ViolinSortBy;
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
              setRNAType(value as GeneExpressionRNAType);
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
              setScale(value as GeneExpressionScale);
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
              setReplicates(value as GeneExpressionReplicates);
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
        <ViolinPlotControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          showPoints={showPoints}
          setShowPoints={setShowPoints}
        />
      ) : (
        <FormControl>
          <StyledFormLabel>View By</StyledFormLabel>
          <ToggleButtonGroup
            color="primary"
            value={viewBy}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setViewBy(value as GeneExpressionViewBy);
              }
            }}
            aria-label="View By"
            size="small"
            disabled={disabled}
          >
            <ToggleButton sx={{ textTransform: "none" }} value="byExperimentTPM">
              Experiment
            </ToggleButton>
            <Tooltip title="Disables sorting in table">
              <ToggleButton sx={{ textTransform: "none" }} value="byTissueTPM">
                Tissue
              </ToggleButton>
            </Tooltip>
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
