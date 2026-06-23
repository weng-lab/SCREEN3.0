import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export type DistanceAnchor = "middleAnchor" | "edgeAnchor";

/**
 * Shared state + column-header tooltip for toggling whether the distance to a gene's TSS is
 * measured from the middle of the cCRE body or its nearest edge. The tooltip renders a toggle
 * button; consumers read `anchor` to decide which distance to display, and drop `tooltip` onto
 * the relevant column.
 *
 * Used by both {@link useNearestTSSColumn} (per-row column value) and the closest-genes table in
 * `CcreLinkedGenes` (whole row-set swap) — the fetching/rendering differs, only this state + UI is shared.
 */
export const useDistanceAnchor = () => {
  // Whether the distance is measured from the middle of the cCRE body or its nearest edge
  const [anchor, setAnchor] = useState<DistanceAnchor>("middleAnchor");

  const tooltip = (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="body2" gutterBottom>
        Distance to TSS measured from the{" "}
        {anchor === "middleAnchor" ? "middle of the cCRE" : "nearest edge of the cCRE"}.
        Classification uses the middle of the cCRE as anchor for distance to TSS, or 0 if the cCRE overlaps.
      </Typography>
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: "common.white",
          borderColor: "common.white",
          "&:hover": {
            borderColor: "common.white",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
        onClick={() => setAnchor((prev) => (prev === "middleAnchor" ? "edgeAnchor" : "middleAnchor"))}
      >
        Measure from {anchor === "middleAnchor" ? "nearest edge" : "middle"} instead
      </Button>
    </Box>
  );

  return { anchor, tooltip };
};
