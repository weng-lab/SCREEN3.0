import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type PlotTooltipRow = {
  label: string;
  value: ReactNode;
};

export type PlotTooltipProps = {
  /** The mark's identity - shown bold and unlabeled, above the detail rows. */
  title: ReactNode;
  /** A caveat about the mark itself, in italics under the title - e.g. that the filters hide it. */
  note?: ReactNode;
  rows: PlotTooltipRow[];
};

/** Shared tooltip body for every plot, as MOHD's. Held to a width, as biosample names can run long. */
const PlotTooltip = ({ title, note, rows }: PlotTooltipProps) => (
  <Box sx={{ p: 1, maxWidth: 350 }}>
    <Typography variant="body2">
      <strong>{title}</strong>
    </Typography>
    {note && (
      <Typography variant="caption" display="block" color="text.secondary" fontStyle="italic">
        {note}
      </Typography>
    )}
    {rows.map((row) => (
      <Typography key={row.label} variant="caption" display="block">
        {row.label}: {row.value}
      </Typography>
    ))}
  </Box>
);

export default PlotTooltip;
