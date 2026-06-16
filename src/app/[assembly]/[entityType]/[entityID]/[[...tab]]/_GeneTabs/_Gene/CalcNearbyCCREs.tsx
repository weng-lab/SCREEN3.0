import React from "react";
import {
  Popper,
  Paper,
  Box,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
interface CalculateNearbyCCREsPopperProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  handleClickAway: () => void;
  calcMethod: "body" | "tss" | "3gene";
  handleMethodChange: (method: "body" | "tss" | "3gene") => void;
  range: [number, number];
  handleRangeChange: (range: [number, number]) => void;
}

const CalculateNearbyCCREsPopper: React.FC<CalculateNearbyCCREsPopperProps> = ({
  open,
  anchorEl,
  handleClickAway,
  calcMethod,
  handleMethodChange,
  range,
  handleRangeChange,
}) => {
  const isDistanceDisabled = calcMethod !== "tss";

  // Track the slider value locally so the handle follows the mouse during drag.
  const [localRange, setLocalRange] = React.useState(range);

  React.useEffect(() => {
    setLocalRange(range);
  }, [range]);

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal sx={{ zIndex: 10 }}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper elevation={8} sx={{ minWidth: 200 }}>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ mb: 2 }}>Calculate Nearby cCREs by:</Typography>
            <Stack direction={"row"} spacing={2}>
              <FormControl>
                <RadioGroup
                  row
                  value={calcMethod}
                  onChange={(event) => handleMethodChange(event.target.value as "body" | "tss" | "3gene")}
                >
                  <FormControlLabel value="tss" control={<Radio />} label={"Distance to TSS"} />
                  <FormControlLabel value="body" control={<Radio />} label={"Gene Body Overlap"} />
                  <FormControlLabel value="3gene" control={<Radio />} label={"Gene is 1 of 3 closest"} />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Box sx={{ width: "100%", padding: 2 }}>
              <Typography
                variant="caption"
                color={isDistanceDisabled ? "text.disabled" : "text.secondary"}
                sx={{ display: "block", mb: 1 }}
              >
                Window around TSS (upstream / downstream)
              </Typography>
              <Tooltip title={isDistanceDisabled ? 'Only applies to the "Distance to TSS" method' : ""} placement="top">
                <Box>
                  <Slider
                    aria-label="Window around TSS"
                    getAriaValueText={formatTssOffset}
                    valueLabelFormat={formatTssOffset}
                    valueLabelDisplay="auto"
                    min={-100000}
                    max={100000}
                    step={1000}
                    value={localRange}
                    onChange={(_, value) => setLocalRange(value as [number, number])}
                    onChangeCommitted={(_, value) => handleRangeChange(value as [number, number])}
                    marks={tssMarks}
                    disabled={isDistanceDisabled}
                  />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

// Signed offset relative to the TSS: negative = upstream, positive = downstream
export const formatTssOffset = (value: number) => {
  if (value === 0) return "TSS";
  return `${Math.abs(value) / 1000}kb ${value < 0 ? "upstream" : "downstream"}`;
};

const tssMarks = [
  {
    value: -100000,
    label: "-100kb",
  },
  {
    value: -50000,
    label: "-50kb",
  },
  {
    value: -25000,
    label: "-25kb",
  },
  {
    value: 0,
    label: "TSS",
  },
  {
    value: 25000,
    label: "+25kb",
  },
  {
    value: 50000,
    label: "+50kb",
  },
  {
    value: 100000,
    label: "+100kb",
  },
];

export default CalculateNearbyCCREsPopper;
