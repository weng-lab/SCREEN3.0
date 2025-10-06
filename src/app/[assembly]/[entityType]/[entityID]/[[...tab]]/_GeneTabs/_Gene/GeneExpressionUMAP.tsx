import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Point, ScatterPlot, ChartProps } from "@weng-lab/visualization";
import { tissueColors } from "common/lib/colors"
import { theme } from "app/theme";
import { scaleLinear } from "@visx/scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import { Stack } from "@mui/system";
import UMAPLegend from "../../../../../../../common/components/UMAPLegend";

//generate the domain for the gradient based on the max number
   export const generateDomain = (max: number, steps: number) => {
    return Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);
  };

export type GeneExpressionUmapProps<
  T,
  S extends boolean | undefined,
  Z extends boolean | undefined
> = GeneExpressionProps & SharedGeneExpressionPlotProps & Partial<ChartProps<T, S, Z>>;

const GeneExpressionUMAP = <T extends PointMetadata, S extends true, Z extends boolean | undefined>({
  geneData,
  selected,
  geneExpressionData,
  setSelected,
  ...rest
}: GeneExpressionUmapProps<T, S, Z>) => {

  const [colorScheme, setColorScheme] = useState<"expression" | "organ/tissue">("expression");

  const { data, loading } = geneExpressionData;

  const handleColorSchemeChange = (event: SelectChangeEvent) => {
    setColorScheme(event.target.value as "expression" | "organ/tissue");
  };

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
          color: getColor(),
          metaData: x,
        };
      })
  }, [data, selected, colorScale, colorScheme]);

  const handlePointsSelected = (selectedPoints: Point<PointMetadata>[]) => {
    setSelected([...selected, ...selectedPoints.map(point => point.metaData)]);
  };

  const TooltipBody = (point: Point<PointMetadata>) => {
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
          <MenuItem value={"organ/tissue"}>Tissue</MenuItem>
        </Select>
      </FormControl>
    );
  };

  return (
    <>
      <Stack
        width={"100%"}
        height={"100%"}
        padding={1}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <ColorBySelect />
          <UMAPLegend
            colorScheme={colorScheme}
            scatterData={scatterData}
            maxValue={maxValue}
            colorScale={colorScale}
          />
        </Stack>
        <Box sx={{ flexGrow: 1 }}>
          <ScatterPlot
            {...rest}
            onSelectionChange={handlePointsSelected}
            controlsHighlight={theme.palette.primary.light}
            pointData={scatterData}
            selectable
            loading={loading}
            miniMap={map}
            groupPointsAnchor="accession"
            tooltipBody={(point) => <TooltipBody {...point} />}
          />
        </Box>
      </Stack>
    </>
  );
};

export default GeneExpressionUMAP;
