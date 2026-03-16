import { GeneExpressionUMAPProps, getLogTPM, getTPM, PointMetadata } from "./types";
import { Box, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Point, ScatterPlot } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import { theme } from "app/theme";
import { scaleLinear } from "@visx/scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { Stack } from "@mui/system";
import UMAPLegend from "common/components/UMAPLegend";
import { ColorBySelect } from "common/components/ColorBySelect";

//generate the domain for the gradient based on the max number
export const generateDomain = (max: number, steps: number) => {
  return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
};

const MINIMAP_CONFIG = { position: { right: 50, bottom: 50 } };

const GeneExpressionUMAP = ({
  geneName,
  rows,
  highlightedAccessions,
  onPointToggle,
  onLassoSelect,
  loading,
  ref,
}: GeneExpressionUMAPProps) => {
  const [colorScheme, setColorScheme] = useState<"expression" | "organ/tissue">("expression");

  // Band-aid: ScatterPlot's controls are absolutely positioned on the left of the container.
  // The square plot uses min(width, height), so we keep height < width to ensure the controls
  // don't overlap the plot. Measure the container width and cap height at width - CONTROLS_OFFSET.
  const CONTROLS_OFFSET = 65;
  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotContainerWidth, setPlotContainerWidth] = useState(0);
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setPlotContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleColorSchemeChange = (event: SelectChangeEvent) => {
    setColorScheme(event.target.value as "expression" | "organ/tissue");
  };

  //find the max logTPM for the domain of the gradient
  const maxValue = useMemo(() => {
    if (!rows || rows.length === 0) return 0;
    return Math.max(...rows.map((x) => getLogTPM(x)));
  }, [rows]);

  const colorScale = useMemo(
    () =>
      scaleLinear({
        domain: generateDomain(maxValue, 9), // 9 evenly spaced domain stops (9 colors)
        range: Array.from({ length: 9 }, (_, i) => i / 8), // Normalize range for interpolation
        clamp: true,
      }),
    [maxValue]
  );

  const scatterData: Point<PointMetadata>[] = useMemo(() => {
    if (!rows) return [];

    const anyHighlighted = highlightedAccessions.size > 0;
    const isHighlighted = (x: PointMetadata) => highlightedAccessions.has(x.exp_accession);

    return rows.map((x) => {
      const gradientColor = interpolateYlOrRd(colorScale(getLogTPM(x)));

      const getColor = () => {
        if (isHighlighted(x) || !anyHighlighted) {
          if (colorScheme === "expression") {
            return gradientColor;
          } else return tissueColors[x.tissue];
        } else return "#CCCCCC";
      };

      return {
        x: x.umap_1,
        y: x.umap_2,
        r: isHighlighted(x) ? 6 : 4,
        color: getColor(),
        metaData: x,
      };
    });
  }, [rows, highlightedAccessions, colorScale, colorScheme]);

  const handlePointsSelected = (selectedPoints: Point<PointMetadata>[]) => {
    onLassoSelect(selectedPoints.map((point) => point.metaData));
  };

  const handlePointSelected = (selectedPoint: Point<PointMetadata>) => {
    onPointToggle(selectedPoint.metaData);
  };

  const TooltipBody = (point: Point<PointMetadata>) => {
    return (
      <>
        <Typography>
          <b>Accession:</b> {point.metaData.exp_accession}
        </Typography>
        <Typography>
          <b>Biosample:</b> {point.metaData.biosample}
        </Typography>
        <Typography>
          <b>Tissue:</b> {point.metaData.tissue}
        </Typography>
        <Typography>
          <b>Log₁₀(TPM + 1):</b> {getLogTPM(point.metaData).toFixed(2)}
        </Typography>
        <Typography>
          <b>TPM:</b> {getTPM(point.metaData).toFixed(2)}
        </Typography>
      </>
    );
  };

  if (!scatterData || scatterData.length === 0) return null;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <ColorBySelect colorScheme={colorScheme} handleColorSchemeChange={handleColorSchemeChange} />
        <UMAPLegend colorScheme={colorScheme} scatterData={scatterData} maxValue={maxValue} colorScale={colorScale} />
      </Stack>
      <Box
        ref={plotContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          ...(plotContainerWidth > 0 && { maxHeight: plotContainerWidth - CONTROLS_OFFSET }),
        }}
      >
        <ScatterPlot
          onSelectionChange={handlePointsSelected}
          onPointClicked={handlePointSelected}
          controlsHighlight={theme.palette.primary.light}
          pointData={scatterData}
          selectable
          loading={loading}
          miniMap={MINIMAP_CONFIG}
          groupPointsAnchor="exp_accession"
          tooltipBody={(point) => <TooltipBody {...point} />}
          leftAxisLabel="UMAP-2"
          bottomAxisLabel="UMAP-1"
          ref={ref}
          downloadFileName={`${geneName}_expression_UMAP`}
          animation="scale"
          animationBuffer={0.01}
          animationGroupSize={15}
        />
      </Box>
    </Box>
  );
};

export default GeneExpressionUMAP;
