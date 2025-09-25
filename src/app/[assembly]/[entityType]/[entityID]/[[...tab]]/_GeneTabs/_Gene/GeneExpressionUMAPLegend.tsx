import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { PointMetadata } from "./GeneExpression";
import { Point } from "@weng-lab/visualization";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { TooltipInPortalProps } from "@visx/tooltip/lib/hooks/useTooltipInPortal";
import { localPoint } from "@visx/event";
import { tissueColors } from "common/lib/colors"
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { ScaleLinear } from "d3-scale";
import { generateDomain } from "./GeneExpressionUMAP";

type Data = {
    label: string;
    color: string;
};

type GeneExpressionUMAPLegendProps = {
    colorScheme: "expression" | "tissue";
    scatterData: Point<PointMetadata>[]
    maxValue: number;
    colorScale: ScaleLinear<number, number, never>
};

export default function GeneExpressionUMAPLegend({
    colorScheme,
    scatterData,
    maxValue,
    colorScale
}: GeneExpressionUMAPLegendProps) {
    const { containerRef, TooltipInPortal } = useTooltipInPortal(
        {
            scroll: true,
            detectBounds: true,
        }
    );

    //Fix weird type error on build
    //Type error: 'TooltipInPortal' cannot be used as a JSX component.
    const TooltipComponent = TooltipInPortal as unknown as React.FC<TooltipInPortalProps>;

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<Data>();

    const handleMouseOver = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        datum
    ) => {
        const coords = localPoint(event, event);
        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: datum,
        });
    };

    const legendEntries = useMemo(() => {
        if (!scatterData) return [];

        if (colorScheme === "tissue") {
            // Count occurrences of each unique cellType
            const cellTypeCounts = scatterData.reduce((acc, point) => {
                const cellType = point.metaData.tissue;
                acc.set(cellType, (acc.get(cellType) || 0) + 1);
                return acc;
            }, new Map<string, number>());

            return Array.from(cellTypeCounts.entries())
                .map(([cellType, count]) => ({
                    label: (cellType),
                    color: tissueColors[cellType],
                    value: count,
                }))
                .sort((a, b) => b.value - a.value);
        }
    }, [scatterData, colorScheme]);

    const generateGradient = (maxValue: number) => {
        const stops = generateDomain(maxValue, 9).map(value => interpolateYlOrRd(colorScale(value)));
        return `#808080, ${stops.join(", ")}`;
    };

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
            ) : (
                <Stack
                    direction="row"
                    spacing={0.5}
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
                    <Typography color="text.secondary" fontWeight="bold">
                        Legend
                    </Typography>
                    <InfoOutlinedIcon fontSize="small" color="action" />
                </Stack>

            )}
            {tooltipOpen && tooltipData && (
                <TooltipComponent
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={{ zIndex: 1000, ...defaultStyles }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                legendEntries?.length / 4 >= 3 ? "space-between" : "flex-start",
                            gap: legendEntries?.length / 4 >= 4 ? 0 : 10,
                            p: 1,
                        }}
                    >
                        {Array.from(
                            { length: Math.ceil(legendEntries?.length / 4) },
                            (_, colIndex) => (
                                <Box key={colIndex} sx={{ mr: 2 }}>
                                    {legendEntries
                                        .slice(colIndex * 4, colIndex * 4 + 4)
                                        .map((cellType, index) => (
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
                                                        .map(
                                                            (word) =>
                                                                word.charAt(0).toUpperCase() + word.slice(1)
                                                        )
                                                        .join(" ")}
                                                    {colorScheme === "tissue"
                                                        ? `: ${cellType.value}`
                                                        : ""}
                                                </Typography>
                                            </Box>
                                        ))}
                                </Box>
                            )
                        )}
                    </Box>
                </TooltipComponent>
            )}
        </>
    );
}