import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import { PointMetaData } from "../types";
import { Point } from "@weng-lab/visualization";

type LegendProps = {
  scatterData: Point<PointMetaData>[];
  colorBy: "sampleType" | "ontology";
  sampleTypeColors: Record<string, string>;
  ontologyColors: Record<string, string>;
};

const UmapLegend = ({ scatterData, colorBy, sampleTypeColors, ontologyColors }: LegendProps) => {
  const legendEntries = useMemo(() => {
    // Create a color-count map based on scatterData
    const colorCounts = scatterData.reduce(
      (acc, point) => {
        const color = point.color;
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const colorMapping = colorBy === "sampleType" ? sampleTypeColors : ontologyColors;

    // Map the color counts to the same format as before: label, color, and value
    return Object.entries(colorCounts)
      .map(([color, count]) => ({
        label: Object.keys(colorMapping).find((key) => colorMapping[key] === color) || color,
        color,
        value: count,
      }))
      .filter((x) => x.label !== "#aaaaaa") // quick fix for removing greyed out points from legend. Should be setup differently than this (why do we need to do this)
      .sort((a, b) => b.value - a.value);
  }, [scatterData, colorBy, sampleTypeColors, ontologyColors]);

  return (
    <Box mt={2} mb={5} sx={{ display: "flex", flexDirection: "column" }}>
      <Typography mb={1}>
        <b>Legend</b>
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: legendEntries.length / 6 >= 3 ? "space-between" : "flex-start",
          gap: legendEntries.length / 6 >= 4 ? 0 : 10,
        }}
      >
        {Array.from({ length: Math.ceil(legendEntries.length / 6) }, (_, colIndex) => (
          <Box key={colIndex} sx={{ marginRight: 2 }}>
            {legendEntries.slice(colIndex * 6, colIndex * 6 + 6).map((element, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <Box
                  sx={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: element.color,
                    marginRight: 1,
                  }}
                />
                <Typography>
                  {`${element.label
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}: ${element.value}`}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UmapLegend;
