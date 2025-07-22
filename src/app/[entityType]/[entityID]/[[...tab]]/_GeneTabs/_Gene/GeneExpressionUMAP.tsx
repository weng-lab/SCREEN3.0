import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
import { useMemo, useRef, useState } from "react";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { scaleLinear } from "d3-scale";
import { Point, ScatterPlot, ChartProps } from "@weng-lab/visualization";

export type GeneExpressionUmapProps<
  T,
  S extends boolean | undefined,
  Z extends boolean | undefined
> = GeneExpressionProps & SharedGeneExpressionPlotProps & Partial<ChartProps<T, S, Z>>;

const GeneExpressionUMAP = <T extends PointMetadata, S extends true, Z extends boolean | undefined>({
  geneData,
  selected,
  geneExpressionData,
  ...rest
}: GeneExpressionUmapProps<T, S, Z>) => {
  const [colorScheme, setColorScheme] = useState<"expression" | "lineage">("expression");
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const { data, loading, error } = geneExpressionData;

  const handleColorSchemeChange = (event: SelectChangeEvent) => {
    setColorScheme(event.target.value as "expression" | "lineage");
  };
  const graphContainerRef = useRef(null);

  const map = {
    position: {
      right: 50,
      bottom: 50,
    },
  };

  function logTransform(val: number) {
    return Math.log10(val + 1);
  }

  //find the max logTPM for the domain fo the gradient
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((x) => logTransform(x.value)));
  }, [data]);

  //generate the domain for the gradient based on the max number
  const generateDomain = (max: number, steps: number) => {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
  };

  /**
   * @todo why is this using d3 scaleLinear and not visx
   */
  const colorScale = useMemo(
    () =>
      scaleLinear<number, number>()
        .domain(generateDomain(maxValue, 9)) // 9 evenly spaced domain stops (9 colors)
        .range(Array.from({ length: 9 }, (_, i) => i / 8)) // Normalize range for interpolation
        .clamp(true),
    [maxValue]
  );

  const generateGradient = (maxValue: number) => {
    const stops = generateDomain(maxValue, 9).map((value) => interpolateYlOrRd(colorScale(value)));
    return `#808080, ${stops.join(", ")}`;
  };

  const scatterData: Point<PointMetadata>[] = useMemo(() => {
    if (!data) return [];

    const isHighlighted = (x: PointMetadata) => selected.some((y) => y.name === x.name);

    return data
      .map((x) => {
        const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.value)));

        return {
          x: x.umap_1,
          y: x.umap_2,
          r: isHighlighted(x) ? 6 : 4,
          color:
            isHighlighted(x) || selected.length === 0
              ? colorScheme === "expression"
                ? gradientColor
                : getCellCategoryColor(x.lineage)
              : "#CCCCCC",
          shape: x.stimulation === "unstimulated" ? "circle" : ("triangle" as "circle" | "triangle"),
          metaData: x,
        };
      })
      .sort((a, b) => (isHighlighted(b.metaData) ? -1 : 0));
  }, [data, colorScale, selected, colorScheme]);

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "lineage") {
      // Count occurrences of each unique cellType
      const cellTypeCounts = scatterData.reduce((acc, point) => {
        const cellType = point.metaData.lineage;
        acc.set(cellType, (acc.get(cellType) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      return Array.from(cellTypeCounts.entries())
        .map(([cellType, count]) => ({
          label: getCellCategoryDisplayname(cellType),
          color: getCellCategoryColor(cellType),
          value: count,
        }))
        .sort((a, b) => b.value - a.value);
    }
  }, [scatterData, colorScheme]);

  const TooltipBody = (point: Point<PointMetadata>) => {
    return (
      <>
        <Typography>
          <b>Lineage:</b> {getCellCategoryDisplayname(point.metaData.lineage)}
        </Typography>
        <Typography>
          <b>Biosample:</b> {point.metaData.biosample}, {point.metaData.stimulation}
        </Typography>
        <Typography>
          <b>TPM:</b> {point.metaData.value.toFixed(1)}
        </Typography>
        <Typography>
          <b>Source:</b> {point.metaData.source}
        </Typography>
      </>
    );
  };

  const ColorBySelect = () => {
    return (
      <FormControl sx={{ alignSelf: "flex-start" }}>
        <InputLabel>Color By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={colorScheme}
          label="Color By"
          onChange={handleColorSchemeChange}
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value={"expression"}>Expression</MenuItem>
          <MenuItem value={"lineage"}>Lineage</MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <>
      <ColorBySelect />
      <Box
        padding={1}
        //hacky height, have to subtract the pixel value of the Colorby select and the margin to line it up with the table
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          position: "relative",
          width: "100%",
          height: "calc(100% - 72px)",
        }}
        ref={graphContainerRef}
        mt={2}
        mb={2}
        zIndex={0}
      >
        <Typography variant="body2" align="right">
          {"\u25EF unstimulated, \u25B3 stimulated "}
        </Typography>
        <ScatterPlot
          {...rest}
          controlsHighlight="#c83444"
          pointData={scatterData}
          selectable
          loading={loading}
          miniMap={map}
          groupPointsAnchor="lineage"
          tooltipBody={(point) => <TooltipBody {...point} />}
        />
        <Button
          variant="outlined"
          sx={{ position: "absolute", bottom: 10, left: 10, textTransform: "none" }}
          onClick={() => setShowLegend(!showLegend)}
        >
          Toggle Legend
        </Button>
      </Box>
      {/* legend */}
      {showLegend && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography mb={1}>
            <b>Legend</b>
          </Typography>
          {colorScheme === "expression" ? (
            <>
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
            </>
          ) : (
            /**
             * @todo clean this up. No way this legend needs to be this complicated
             */
            /* Normal legend for cell types */
            <Box
              sx={{
                display: "flex",
                justifyContent: legendEntries.length / 4 >= 3 ? "space-between" : "flex-start",
                gap: legendEntries.length / 4 >= 4 ? 0 : 10,
              }}
            >
              {Array.from({ length: Math.ceil(legendEntries.length / 4) }, (_, colIndex) => (
                <Box key={colIndex} sx={{ marginRight: 2 }}>
                  {legendEntries.slice(colIndex * 4, colIndex * 4 + 4).map((cellType, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                      <Box sx={{ width: "12px", height: "12px", backgroundColor: cellType.color, marginRight: 1 }} />
                      <Typography>
                        {`${cellType.label
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}`}
                        {colorScheme === "lineage" ? `: ${cellType.value}` : ""}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default GeneExpressionUMAP;
