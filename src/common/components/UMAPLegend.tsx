import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Point } from "@weng-lab/visualization";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { TooltipInPortalProps } from "@visx/tooltip/lib/hooks/useTooltipInPortal";
import { localPoint } from "@visx/event";
import { tissueColors } from "common/colors";

type GradientConfig = {
  label?: string;
  minLabel: string;
  maxLabel: string;
  gradient: string;
};

type UMAPLegendProps<T> = {
  colorScheme: "expression" | "score" | "organ/tissue" | "sampleType";
  scatterData: Point<T>[];
  gradientConfig?: GradientConfig;
  getTissue?: (item: T) => string;
  getSampleType?: (item: T) => string;
};

export default function UMAPLegend<T>({
  colorScheme,
  scatterData,
  gradientConfig,
  getTissue,
  getSampleType,
}: UMAPLegendProps<T>) {
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  });

  //Fix weird type error on build
  //Type error: 'TooltipInPortal' cannot be used as a JSX component.
  const TooltipComponent = TooltipInPortal as unknown as React.FC<TooltipInPortalProps>;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<Point<T>[]>();

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const coords = localPoint(event.currentTarget, event);
      showTooltip({
        tooltipLeft: coords?.x ?? 0,
        tooltipTop: coords?.y ?? 0,
        tooltipData: scatterData,
      });
    },
    [showTooltip, scatterData]
  );

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "organ/tissue" || colorScheme === "sampleType") {
      const cellTypeCounts = new Map<string, number>();

      const accessor = colorScheme === "organ/tissue" ? getTissue : getSampleType;

      scatterData.forEach((point) => {
        const cellType = accessor?.(point.metaData) ?? "missing";
        cellTypeCounts.set(cellType, (cellTypeCounts.get(cellType) || 0) + 1);
      });

      return Array.from(cellTypeCounts.entries())
        .map(([cellType, count]) => ({
          label: cellType,
          color: tissueColors[cellType] ?? tissueColors.missing,
          value: count,
        }))
        .sort((a, b) => b.value - a.value);
    }

    return [];
  }, [scatterData, colorScheme, getTissue, getSampleType]);

  const cols = 6;

  return (
    <>
      {gradientConfig && (colorScheme === "expression" || colorScheme === "score") ? (
        <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
          {gradientConfig.label && <Typography>{gradientConfig.label}</Typography>}
          <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
            <Typography sx={{ mr: 1 }}>{gradientConfig.minLabel}</Typography>
            <Box
              sx={{
                height: "14px",
                flexGrow: 1,
                background: `linear-gradient(to right, ${gradientConfig.gradient})`,
              }}
            />
            <Typography sx={{ ml: 1 }}>{gradientConfig.maxLabel}</Typography>
          </Box>
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mr={1}
          onMouseMove={handleMouseMove}
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
