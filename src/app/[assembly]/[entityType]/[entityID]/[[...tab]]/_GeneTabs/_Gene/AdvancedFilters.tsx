import React from "react";
import {
  Popper,
  Paper,
  Box,
  Stack,
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  ClickAwayListener,
  Button,
} from "@mui/material";

interface AdvancedFiltersPopperProps {
  open: boolean;
  anchorEl: any; // virtual anchor object
  assembly: string;
  RNAtype: string;
  scale: string;
  viewBy: string;
  replicates: string;
  handleClickAway: () => void;
  handleRNATypeChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  handleScaleChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  handleViewChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  handleReplicatesChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;
  handleReset: () => void;
}

const AdvancedFiltersPopper: React.FC<AdvancedFiltersPopperProps> = ({
  open,
  anchorEl,
  assembly,
  RNAtype,
  scale,
  viewBy,
  replicates,
  handleClickAway,
  handleRNATypeChange,
  handleScaleChange,
  handleViewChange,
  handleReplicatesChange,
  handleReset,
}) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom"
      disablePortal
      sx={{ zIndex: 10 }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper elevation={8} sx={{ minWidth: 200 }}>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" gap={2} flexWrap="wrap">
              <FormControl>
                <FormLabel>RNA-seq Type</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={RNAtype}
                  exclusive
                  onChange={handleRNATypeChange}
                  aria-label="RNA-seq Type"
                  size="small"
                >
                  <ToggleButton sx={{ textTransform: "none" }} value="total RNA-seq">
                    Total
                  </ToggleButton>
                  <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
                    <div>
                      <ToggleButton
                        disabled={assembly === "GRCh38"}
                        sx={{ textTransform: "none" }}
                        value="polyA plus RNA-seq"
                      >
                        PolyA+
                      </ToggleButton>
                    </div>
                  </Tooltip>
                  <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
                    <div>
                      <ToggleButton
                        disabled={assembly === "GRCh38"}
                        sx={{ textTransform: "none" }}
                        value="all"
                      >
                        All
                      </ToggleButton>
                    </div>
                  </Tooltip>
                </ToggleButtonGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Scale</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={scale}
                  exclusive
                  onChange={handleScaleChange}
                  aria-label="Scale"
                  size="small"
                >
                  <ToggleButton sx={{ textTransform: "none" }} value="linearTPM">
                    Linear TPM
                  </ToggleButton>
                  <ToggleButton sx={{ textTransform: "none" }} value="logTPM">
                    Log<sub>10</sub>(TPM + 1)
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>

              <FormControl>
                <FormLabel>View By</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={viewBy}
                  exclusive
                  onChange={handleViewChange}
                  aria-label="View By"
                  size="small"
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

              <FormControl>
                <FormLabel>Replicates</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={replicates}
                  exclusive
                  onChange={handleReplicatesChange}
                  aria-label="Replicates"
                  size="small"
                >
                  <ToggleButton sx={{ textTransform: "none" }} value="mean">
                    Average
                  </ToggleButton>
                  <ToggleButton sx={{ textTransform: "none" }} value="all">
                    Show Replicates
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Stack>

            {/* Reset button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="text"
                onClick={handleReset}
                disabled={
                  replicates === "mean" &&
                  scale === "linearTPM" &&
                  viewBy === "byExperimentTPM" &&
                  RNAtype === "total RNA-seq"
                }
                sx={{
                  textTransform: "none",
                  color: "primary.main",
                  p: 0,
                  minWidth: "auto",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default AdvancedFiltersPopper;
