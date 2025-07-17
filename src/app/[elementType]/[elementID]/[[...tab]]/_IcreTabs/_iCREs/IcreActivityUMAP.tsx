import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"
import { useEffect, useMemo, useRef, useState } from "react"
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { Point, ScatterPlot, ChartProps } from "@weng-lab/psychscreen-ui-components"
import { IcreActivityProps, SharedIcreActivityPlotProps, PointMetadata } from "./IcreActivity"
import { scaleLinear } from "@visx/scale";

export type IcreActivityUmapProps<T, S extends boolean | undefined, Z extends boolean | undefined> =
  IcreActivityProps
  & SharedIcreActivityPlotProps
  & Partial<ChartProps<T, S, Z>>

const IcreActivityUMAP = <T extends PointMetadata, S extends true, Z extends boolean | undefined>({ accession, selected, sortedFilteredData, iCREActivitydata, ...rest }: IcreActivityUmapProps<T, S, Z>) => {
  const [colorScheme, setColorScheme] = useState<'Zscore' | 'lineage'>('Zscore');
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [assay, setAssay] = useState<'ATAC' | 'DNase' | 'Combined'>('Combined')

  const { data, loading, error } = iCREActivitydata

  const handleColorSchemeChange = (
    event: SelectChangeEvent,
  ) => {
    setColorScheme(event.target.value as 'Zscore' | 'lineage');
  };

  const handleAssayChange = (
    event: SelectChangeEvent,
  ) => {
    setAssay(event.target.value as 'ATAC' | 'DNase' | 'Combined');
  };

  const graphContainerRef = useRef(null);

  const map = {
    position: {
      right: 50,
      bottom: 50,
    },
  };

  //prevent scroll on UMAP
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (graphContainerRef.current && graphContainerRef.current.contains(event.target)) {
        event.preventDefault(); // Prevent page scroll
        // Your zoom logic here
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  //find the max logTPM for the domain fo the gradient
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map((x) => x.value));
  }, [data]);


  //find the max logTPM for the domain fo the gradient
  const minValue = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.min(...data.map((x) => x.value));
  }, [data]);


  //generate the domain for the gradient based on the max number
  const generateDomain = (max: number, steps: number) => {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
  };

  const colorScale = useMemo(() =>
    scaleLinear({
      domain: generateDomain(maxValue, 9), // 9 evenly spaced domain stops (9 colors)
      range: Array.from({ length: 9 }, (_, i) => i / 8), // Normalize range for interpolation
      clamp: true
    }),
    [maxValue]
  );

  const generateGradient = (maxValue: number) => {
    const stops = generateDomain(maxValue, 9).map(value => interpolateYlOrRd(colorScale(value)));
    return `#808080, ${stops.join(", ")}`;
  };

  const scatterData: Point<PointMetadata>[] = useMemo(() => {
    if (!data) return []

    const isHighlighted = (d: PointMetadata) => selected.some(x => x.name === d.name)

    return data.map((x) => {
      const gradientColor = interpolateYlOrRd(colorScale(x.value))

      const getColor = () => {
        if ((isHighlighted(x) || selected.length === 0)) {
          if (colorScheme === 'Zscore') {
            return gradientColor
          } else return getCellCategoryColor(x.lineage)
        } else return '#CCCCCC'
      }

      return {
        x: assay === "Combined" ? x.umap_1 : assay === "ATAC" ? x.umap_atac_1 : x.umap_dnase_1,
        y: assay === "Combined" ? x.umap_2 : assay === "ATAC" ? x.umap_atac_2 : x.umap_dnase_2,
        r: isHighlighted(x) ? 6 : 4,
        color: getColor(),
        shape: x.stimulation === "unstimulated" ? "circle" : "triangle" as "circle" | "triangle",
        metaData: x
      };
    }).sort((a, b) => (isHighlighted(b.metaData)) ? -1 : 0)
  }, [data, colorScale, selected, assay, colorScheme]);

  const legendEntries = useMemo(() => {
    if (!scatterData) return [];

    if (colorScheme === "lineage") {
      // Count occurrences of each unique cellType
      const cellTypeCounts = scatterData.reduce((acc, point) => {
        const cellType = point.metaData.lineage;
        acc.set(cellType, (acc.get(cellType) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      return Array.from(cellTypeCounts.entries()).map(([cellType, count]) => ({
        label: getCellCategoryDisplayname(cellType),
        color: getCellCategoryColor(cellType),
        value: count
      })).sort((a, b) => b.value - a.value);
    }
  }, [scatterData, colorScheme]);

  const TooltipBody = (point: Point<PointMetadata>) => {
    return (
      <>
        <Typography><b>Lineage:</b> {getCellCategoryDisplayname(point.metaData.lineage)}</Typography>
        <Typography><b>Biosample:</b> {point.metaData.biosample}, {point.metaData.stimulation}</Typography>
        <Typography><b>Assay:</b> {point.metaData.assay}</Typography>
        <Typography><b>Z-score:</b> {point.metaData.value.toFixed(2)}</Typography>
        <Typography><b>Source:</b> {point.metaData.source}</Typography>
      </>
    )
  }

  const AssaySelect = () => {
    return (
      <FormControl>
        <InputLabel>Assay</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={assay}
          label="Assay"
          onChange={handleAssayChange}
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value={"Combined"}>ATAC & DNase</MenuItem>
          <MenuItem value={"ATAC"}>ATAC</MenuItem>
          <MenuItem value={"DNase"}>DNase</MenuItem>
        </Select>
      </FormControl>
    )
  }

  const ColorBySelect = () => {
    return (
      <FormControl>
        <InputLabel>Color By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={colorScheme}
          label="Color By"
          onChange={handleColorSchemeChange}
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value={"Zscore"}>Z-score</MenuItem>
          <MenuItem value={"lineage"}>Lineage</MenuItem>
        </Select>
      </FormControl>
    )
  }

  return (
    <>
      <Stack direction={"row"} spacing={2}>
        <ColorBySelect />
        <AssaySelect />
      </Stack>
      <Box
        padding={1}
        //hacky height, have to subtract the pixel value of the Colorby select and the margin to line it up with the table
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative", width: "100%", height: "calc(100% - 72px)" }}
        ref={graphContainerRef}
        mt={2}
        mb={2}
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
          tooltipBody={(point) => <TooltipBody {...point} />
          }
        />
        <Button variant="outlined" sx={{ position: "absolute", bottom: 10, left: 10, textTransform: "none" }} onClick={() => setShowLegend(!showLegend)}>Toggle Legend</Button>
      </Box>
      {/* legend */}
      {showLegend && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography mb={1}><b>Legend</b></Typography>
          {colorScheme === "Zscore" ? (
            <>
              <Typography>Z-score</Typography>
              <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
                <Typography sx={{ mr: 1 }}>{'< 0'}</Typography>
                <Box
                  sx={{
                    height: "16px",
                    flexGrow: 1,
                    background: `linear-gradient(to right, ${generateGradient(maxValue)})`,
                    border: "1px solid #ccc"
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
            <Box sx={{ display: 'flex', justifyContent: legendEntries.length / 4 >= 3 ? "space-between" : "flex-start", gap: legendEntries.length / 4 >= 4 ? 0 : 10 }}>
              {Array.from({ length: Math.ceil(legendEntries.length / 4) }, (_, colIndex) => (
                <Box key={colIndex} sx={{ marginRight: 2 }}>
                  {legendEntries.slice(colIndex * 4, colIndex * 4 + 4).map((cellType, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                      <Box sx={{ width: '12px', height: '12px', backgroundColor: cellType.color, marginRight: 1 }} />
                      <Typography>
                        {`${cellType.label
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}`}
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
  )
}

export default IcreActivityUMAP