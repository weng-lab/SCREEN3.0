import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { Point, ScatterPlot, ChartProps } from "@weng-lab/visualization";
import { tissueColors } from "common/lib/colors"
import { theme } from "app/theme";
import { scaleLinear } from "@visx/scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Stack } from "@mui/system";

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
  const [colorScheme, setColorScheme] = useState<"expression" | "tissue">("expression");
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const { data, loading, error } = geneExpressionData;

  const handleColorSchemeChange = (event: SelectChangeEvent) => {
    setColorScheme(event.target.value as "expression" | "tissue");
  };
  const graphContainerRef = useRef(null);

  const map = {
    position: {
      right: 50,
      bottom: 50,
    },
  };

  
  //find the max logTPM for the domain fo the gradient
  // const maxValue = useMemo(() => {
  //   if (!data || data.length === 0) return 0;
  //   return Math.max(...data.map((x) => logTransform(x.value)));
  // }, [data]);

  //generate the domain for the gradient based on the max number
  const generateDomain = (max: number, steps: number) => {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
  };
  function logTransform(val: number) {
    return Math.log10(val + 1);
  }
   //find the max logTPM for the domain fo the gradient
   const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((x) => logTransform(x.gene_quantification_files[0].quantifications[0].tpm)));
  }, [data]);

  const colorScale = useMemo(
    () =>
      scaleLinear({
        domain: generateDomain(maxValue, 9), // 9 evenly spaced domain stops (9 colors)
        range: Array.from({ length: 9 }, (_, i) => i / 8), // Normalize range for interpolation
        clamp: true,
      }),
    [maxValue]
  );


  
  const generateGradient = (maxValue: number) => {
    const stops = generateDomain(maxValue, 9).map(value => interpolateYlOrRd(colorScale(value)));
    return `#808080, ${stops.join(", ")}`;
  };

  /**
   * @todo why is this using d3 scaleLinear and not visx
   */
  // const colorScale = useMemo(
  //   () =>
  //     scaleLinear<number, number>()
  //       .domain(generateDomain(maxValue, 9)) // 9 evenly spaced domain stops (9 colors)
  //       .range(Array.from({ length: 9 }, (_, i) => i / 8)) // Normalize range for interpolation
  //       .clamp(true),
  //   [maxValue]
  // );

  // const generateGradient = (maxValue: number) => {
  //   const stops = generateDomain(maxValue, 9).map((value) => interpolateYlOrRd(colorScale(value)));
  //   return `#808080, ${stops.join(", ")}`;
  // };


  const scatterData: Point<PointMetadata>[] = useMemo(() => {
    if (!data) return [];

    const isHighlighted = (x: PointMetadata) => selected.some((y) => y.accession === x.accession);

    return data
      .map((x) => {
        const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.gene_quantification_files[0].quantifications[0].tpm)));        

        const getColor = () => {
          if (isHighlighted(x) || selected.length === 0) {
            if (colorScheme === "expression") {
              return gradientColor;
            } else return tissueColors[x.tissue];
          } else return "#CCCCCC";
        };

        return {
          x: x.umap_1,
          y: x.umap_2,
          r: isHighlighted(x) ? 6 : 4,
          color:  getColor(),
          metaData: x,
        };
      })
  }, [data, selected, colorScale, colorScheme]);

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
          color: tissueColors[cellType] ,
          value: count,
        }))
        .sort((a, b) => b.value - a.value);
    }
  }, [scatterData, colorScheme]);
  console.log("ScatterData", scatterData)

  const TooltipBody = (point: Point<PointMetadata>) => {

    console.log("point", point)
    const avgTPM = (() => {
      const files = point.metaData.gene_quantification_files || [];
      const tpms: number[] = [];
    
      files.forEach(file => {
        if (file.quantifications && file.quantifications.length > 0) {
          const firstTPM = file.quantifications[0].tpm;
          if (firstTPM !== undefined && firstTPM !== null) {
            tpms.push(firstTPM);
          }
        }
      });
    
      if (tpms.length === 0) return null; // or 0 if you prefer
      return tpms.reduce((a, b) => a + b, 0) / tpms.length;
    })();
    return (
      <>
        <Typography>
          <b>Accession:</b> {point.metaData.accession}
        </Typography>
        <Typography>
          <b>Biosample:</b> {point.metaData.biosample}
        </Typography>
        <Typography>
          <b>Tissue:</b> {point.metaData.tissue}
        </Typography>
        <Typography>
          <b>TPM:</b> {colorScheme === "expression" ? logTransform(avgTPM).toFixed(2) : avgTPM.toFixed(2)}
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
          size="small"
        >
          <MenuItem value={"expression"}>Expression</MenuItem>
          <MenuItem value={"tissue"}>Tissue</MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <>
      <Box
        padding={1}
        //hacky height, have to subtract the pixel value of the Colorby select and the margin to line it up with the table
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        ref={graphContainerRef}
        mt={2}
        mb={2}
        zIndex={0}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <ColorBySelect />
          <Tooltip title="ksdhb">
            <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
              <Typography color="action">Legend</Typography>
              <InfoOutlinedIcon fontSize="small" color="action"/>
            </Stack>
          </Tooltip>
        </Stack>

        <ScatterPlot
          {...rest}
          controlsHighlight={theme.palette.primary.light}
          pointData={scatterData}
          selectable
          loading={loading}
          miniMap={map}
          groupPointsAnchor="accession"
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
            (<Box
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
                        {colorScheme === "tissue" ? `: ${cellType.value}` : ""}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>)
          )}
        </Box>
      )}
    </>
  );
};

export default GeneExpressionUMAP;
