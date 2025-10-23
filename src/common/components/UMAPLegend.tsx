import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Point } from "@weng-lab/visualization";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { TooltipInPortalProps } from "@visx/tooltip/lib/hooks/useTooltipInPortal";
import { localPoint } from "@visx/event";
import { tissueColors } from "common/colors";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { ScaleLinear } from "d3-scale";
import { generateDomain } from "../../app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Gene/GeneExpressionUMAP";
import { PointMetadata } from "../../app/[assembly]/[entityType]/[entityID]/[[...tab]]/_GeneTabs/_Gene/GeneExpression";
import { BiosampleRow } from "../../app/[assembly]/[entityType]/[entityID]/[[...tab]]/_CcreTabs/_cCRE/BiosampleActivity";

type Data = {
  label: string;
  color: string;
};

type UMAPLegendProps<T extends BiosampleRow | PointMetadata> = {
  colorScheme: "expression" | "score" | "organ/tissue" | "sampleType";
  scatterData: Point<T>[];
  maxValue: number;
  colorScale: ScaleLinear<number, number, never> | ScaleLinear<string, string, never>;
  scoreColorMode?: "active" | "all";
};

export default function UMAPLegend<T extends BiosampleRow | PointMetadata>({
  colorScheme,
  scatterData,
  maxValue,
  colorScale,
  scoreColorMode,
}: UMAPLegendProps<T>) {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  //Fix weird type error on build
  //Type error: 'TooltipInPortal' cannot be used as a JSX component.
  const TooltipComponent = TooltipInPortal as unknown as React.FC<TooltipInPortalProps>;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<Data>();

  const handleMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, datum) => {
    const coords = localPoint(event, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y - 200,
      tooltipData: datum,
    });
  };

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "organ/tissue" || colorScheme === "sampleType") {
      const cellTypeCounts = new Map<string, number>();

      scatterData.forEach((point) => {
        const meta = point.metaData as any;

        const cellType = meta.tissue ?? (colorScheme === "organ/tissue" ? meta.ontology : meta.sampleType) ?? "missing";

        cellTypeCounts.set(cellType, (cellTypeCounts.get(cellType) || 0) + 1);
      });

      return Array.from(cellTypeCounts.entries())
        .map(([cellType, count]) => ({
          label: cellType,
          color: tissueColors[cellType],
          value: count,
        }))
        .sort((a, b) => b.value - a.value);
    }

    return [];
  }, [scatterData, colorScheme]);

  const generateGradient = (maxValue: number) => {
    const stops = generateDomain(maxValue, 9).map((value) => {
      const scaled = colorScale(value);
      return typeof scaled === "number" ? interpolateYlOrRd(scaled) : scaled; // fallback if it’s already a color string
    });

    return `#808080, ${stops.join(", ")}`;
  };

  const assayLegendGradientValues: string[] = useMemo(() => {
    switch (scoreColorMode) {
      case "active":
        return [colorScale(1.65), colorScale(4)].map(String);
      case "all":
        return [colorScale(-4), colorScale(0), colorScale(4)].map(String);
      default:
        return [];
    }
  }, [colorScale, scoreColorMode]);

  const cols = 6;

  return (
    <>
      {colorScheme === "expression" ? (
        <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
          <Typography>Log₁₀(TPM + 1)</Typography>
          <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
            <Typography sx={{ mr: 1 }}>0</Typography>
            <Box
              sx={{
                height: "16px",
                flexGrow: 1,
                background: `linear-gradient(to right, ${generateGradient(maxValue)})`,
                border: "1px solid #ccc",
              }}
            />
            <Typography sx={{ ml: 1 }}>{maxValue.toFixed(2)}</Typography>
          </Box>
        </Stack>
      ) : colorScheme === "score" ? (
        <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
          <Typography sx={{ mr: 1 }}>{scoreColorMode === "active" ? "1.65" : "-4"}</Typography>
          <Box
            sx={{
              height: "12px",
              flexGrow: 1,
              background: `linear-gradient(to right, ${assayLegendGradientValues.join(", ")})`,
              outline: "1px solid",
              outlineColor: "divider",
            }}
          />
          <Typography sx={{ ml: 1 }}>{4}</Typography>
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mr={1}
          onMouseMove={(e) => handleMouseOver(e, scatterData)}
          onMouseLeave={hideTooltip}
          ref={containerRef}
          sx={{
            cursor: "default",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: "action.hover",
            "&:hover": {
              bgcolor: "action.selected",
            },
            transition: "background-color 0.2s ease",
          }}
        >
          <InfoOutlinedIcon fontSize="small" color="action" />
          <Typography color="text.secondary" fontWeight="bold">
            Legend:
          </Typography>
          {legendEntries.slice(0, 3).map((entry, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: entry.color,
                  borderRadius: "50%",
                  mr: 0.5,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {entry.label}
              </Typography>
            </Box>
          ))}
          {legendEntries.length > 3 && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                ...
              </Typography>
            </Stack>
          )}
        </Stack>
      )}
      {tooltipOpen && tooltipData && (
        <TooltipComponent top={tooltipTop} left={tooltipLeft} style={{ zIndex: 1000, ...defaultStyles }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: legendEntries?.length / cols >= 3 ? "space-between" : "flex-start",
              gap: legendEntries?.length / cols >= 4 ? 0 : 10,
              p: 1,
            }}
          >
            {Array.from({ length: Math.ceil(legendEntries?.length / cols) }, (_, colIndex) => (
              <Box key={colIndex} sx={{ mr: 2 }}>
                {legendEntries.slice(colIndex * cols, colIndex * cols + cols).map((cellType, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: cellType.color,
                        mr: 1,
                        borderRadius: "10px",
                      }}
                    />
                    <Typography variant="body2">
                      {cellType.label
                        .split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                      : {cellType.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </TooltipComponent>
      )}
    </>
  );
}
