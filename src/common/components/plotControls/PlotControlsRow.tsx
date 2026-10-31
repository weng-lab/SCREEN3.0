import { Box } from "@mui/material";
import { HorizontalScroller } from "@weng-lab/visualization";
import type { ReactNode } from "react";

/**
 * A plot's controls in one row that scrolls sideways where they don't fit, rather than wrapping onto
 * rows that take a narrow screen's height from the plot.
 */
export const PlotControlsRow = ({ children }: { children: ReactNode }) => (
  <Box mb={1}>
    <HorizontalScroller label="plot controls" gap={2}>
      {children}
    </HorizontalScroller>
  </Box>
);
