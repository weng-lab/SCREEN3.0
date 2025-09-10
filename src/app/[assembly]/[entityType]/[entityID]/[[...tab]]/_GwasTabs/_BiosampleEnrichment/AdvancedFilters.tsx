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
  ClickAwayListener,
  Button,
} from "@mui/material";

interface AdvancedFiltersProps {
  open: boolean;
  anchorEl: any; // virtual anchor object  
  viewBy: string;  
  handleClickAway: () => void;  
  handleViewChange: (event: React.MouseEvent<HTMLElement>, newValue: string) => void;  
  handleReset: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  open,
  anchorEl,
  viewBy,    
  handleClickAway,
  handleViewChange,  
  handleReset
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
                <FormLabel>View By</FormLabel>
                <ToggleButtonGroup
                  color="primary"
                  value={viewBy}
                  exclusive
                  onChange={handleViewChange}
                  aria-label="View By"
                  size="small"
                >
                  <ToggleButton sx={{ textTransform: "none" }} value="byExperiment">
                    Experiment
                  </ToggleButton>
                  <ToggleButton sx={{ textTransform: "none" }} value="byTissue">
                    Tissue
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
                  viewBy === "byExperimentTPM"
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

export default AdvancedFilters;
