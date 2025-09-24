import { Box, Stack } from "@mui/system";
import { Point, ScatterPlot } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { tissueColors } from "common/lib/colors";
import { Assay, BiosampleRow, formatAssay } from "./BiosampleActivity";
import {  useCallback, useMemo, useState } from "react";
import { gql } from "types/generated";
import { useQuery } from "@apollo/client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { LinearScaleConfig, scaleLinear } from "@visx/scale";
import {
  interpolateOrRd,
  interpolateRdBu,
  interpolateRdYlBu,
} from "d3-scale-chromatic";
import {
  LegendItem,
} from "@visx/legend";

const BIOSAMPLE_UMAP = gql(`
  query BiosampleUmap($assembly: String!, $assay: String!) {
    ccREBiosampleQuery(assay: [$assay], assembly: $assembly) {
      biosamples {
        name
        umap_coordinates(assay: $assay)
      }
    }
  }
`);

const TooltipBody = ({ metaData, assay }: { metaData: BiosampleRow; assay: Assay }) => {
  return (
    <>
      <Typography>
        <b>Sample:</b> {metaData.displayname}
      </Typography>
      <Typography>
        <b>Organ/Tissue:</b> {metaData.ontology}
      </Typography>
      <Typography>
        <b>Sample Type:</b> {metaData.sampleType}
      </Typography>
      <Typography>
        <b>{formatAssay(assay)}:</b> {metaData[assay]}
      </Typography>
    </>
  );
};

const AssayUMAP = ({
  entity,
  rows,
  columns,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  setSortedFilteredData,
}: SharedAssayViewPlotProps) => {
  const [colorScheme, setColorScheme] = useState<"score" | "organ/tissue" | "sampleType">("score");
  const [scoreColorMode, setScoreColorMode] = useState<"active"| "all">("active")

  const handleColorSchemeChange = (e: SelectChangeEvent<"score" | "organ/tissue" | "sampleType">) => {
    setColorScheme(e.target.value);
  };

  const handleScoreColorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScoreColorMode(e.target.value as "active"| "all");
  };

  const {
    data: data_umap,
    loading: loading_umap,
    error: error_umap,
  } = useQuery(BIOSAMPLE_UMAP, {
    variables: {
      assembly: entity.assembly.toLowerCase(),
      assay,
    },
  });

  const colorScale = useMemo(() => {
    let scaleConfig: Partial<Omit<LinearScaleConfig<string>, "type">>
    switch (scoreColorMode) {
      case "active":
        scaleConfig = {
          domain: [1.64, 1.640000001, 4],
          range: ["#DDD", interpolateRdYlBu(0.5), interpolateRdYlBu(0)],
        };
        break;
      case "all":
        scaleConfig = {
          domain: [-4, 0, 4],
          range: [interpolateRdYlBu(1), interpolateRdYlBu(0.5), interpolateRdYlBu(0)],
        };
        break;
    }

    return scaleLinear({
      ...scaleConfig,
      clamp: true,
    });
  }, [scoreColorMode]);

  const getPointColor = useCallback(
    (metadata: BiosampleRow) => {
      switch (colorScheme) {
        case "score":
          return colorScale(metadata[assay]);
        case "organ/tissue":
          return tissueColors[metadata.ontology] ?? tissueColors.missing;
        case "sampleType":
          return tissueColors[metadata.sampleType] ?? tissueColors.missing;
      }
    },
    [assay, colorScale, colorScheme]
  );

  const scatterData: Point<BiosampleRow>[] = useMemo(() => {
    if (!rows || !data_umap || !colorScale) return [];

    const isHighlighted = (x: BiosampleRow) => selected.some((y) => y.name === x.name);

    return rows
      .map((x) => {
        // const gradientColor = interpolateYlOrRd(colorScale(logTransform(x.value)));
        const coords = data_umap.ccREBiosampleQuery.biosamples.find(
          (sample) => sample.name === x.name
        )?.umap_coordinates;
        return {
          x: coords[0] ?? 0,
          y: coords[1] ?? 0,
          shape: "circle" as const,
          r: isHighlighted(x) ? 4 : 2,
          color: isHighlighted(x) || selected.length === 0 ? getPointColor(x) : "#CCCCCC",
          metaData: x,
        };
      })
      .sort((a, b) => a.metaData[assay] - b.metaData[assay])
      .sort((a, b) => (isHighlighted(b.metaData) ? -1 : 0));
  }, [rows, data_umap, colorScale, selected, getPointColor, assay]);

  /**
   * @todo potential bug. Assumes reference equality between rows returned in callback and in state
   */
  const handlePointClick = (point: Point<BiosampleRow>) => {
    if (selected.includes(point.metaData)) {
      setSelected(selected.filter((x) => x.name !== point.metaData.name));
    } else setSelected([...selected, point.metaData]);
  };

  const scoreLegendValues: { label: string; value: number }[] = useMemo(() => {
    switch (scoreColorMode) {
      case "active":
        return [
          { label: "≤ 1.64", value: 1.64 },
          { label: "1.65", value: 1.65 },
          { label: "3", value: 3 },
          { label: "≥ 4", value: 4 },
        ];
      case "all":
        return [
          { label: "≤ -4", value: -4 },
          { label: "-1.65", value: -1.65 },
          { label: "0", value: 0 },
          { label: "1.65", value: 1.65 },
          { label: "≥ 4", value: 4 },
        ];
    }
  }, [scoreColorMode]);

  const legendGradientValues: string[] = useMemo(() => {
    switch (scoreColorMode) {
      case "active":
        return [colorScale(1.65), colorScale(4)];
      case "all":
        return [colorScale(-4), colorScale(0), colorScale(4)];
    }
  }, [scoreColorMode]);

  const Legend = useCallback(() => {
    switch (colorScheme) {
      case "score":
        return (
          // <div style={{ display: "flex", flexDirection: "row" }}>
          //   {scoreLegendValues.map((x, i) => (
          //     <LegendItem margin="0 5px" key={i}>
          //       <svg width={10} height={10}>
          //         <rect fill={colorScale(x.value)} width={10} height={10} />
          //       </svg>
          //       <Typography variant="caption" align="left" margin="0 0 0 4px">
          //         {x.label}
          //       </Typography>
          //     </LegendItem>
          //   ))}
          // </div>
          <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
            <Typography sx={{ mr: 1 }}>{scoreColorMode === "active" ? "1.65" : "-4"}</Typography>
            <Box
              sx={{
                height: "12px",
                flexGrow: 1,
                background: `linear-gradient(to right, ${legendGradientValues.join(', ')})`,
                outline: "1px solid",
                outlineColor: "divider",
              }}
            />
            <Typography sx={{ ml: 1 }}>{4}</Typography>
          </Box>
        );
      case "organ/tissue":
        return;
      case "sampleType":
        return;
    }
  }, [colorScale, colorScheme, scoreLegendValues]);

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <Stack direction={"row"} spacing={1}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Color By</InputLabel>
          <Select value={colorScheme} label="Color By" onChange={handleColorSchemeChange} size="small">
            <MenuItem value={"score"}>Z Score</MenuItem>
            <MenuItem value={"organ/tissue"}>Organ/Tissue</MenuItem>
            <MenuItem value={"sampleType"}>Sample Type</MenuItem>
          </Select>
        </FormControl>
        {colorScheme === "score" && (
          <FormControl>
            <RadioGroup
              value={scoreColorMode}
              onChange={handleScoreColorModeChange}
              row
            >
              <FormControlLabel value="active" control={<Radio />} label="Active Only" />
              <FormControlLabel value="all" control={<Radio />} label="All" />
            </RadioGroup>
          </FormControl>
        )}
        <Legend />
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        <ScatterPlot
          pointData={scatterData}
          onPointClicked={handlePointClick}
          selectable
          loading={loading_umap}
          miniMap={{
            position: {
              right: 50,
              bottom: 50,
            },
          }}
          groupPointsAnchor={colorScheme === "sampleType" ? "sampleType" : "ontology"}
          tooltipBody={(point) => <TooltipBody metaData={point.metaData} assay={assay} />}
        />
      </Box>
    </Stack>
  );
};

export default AssayUMAP;
