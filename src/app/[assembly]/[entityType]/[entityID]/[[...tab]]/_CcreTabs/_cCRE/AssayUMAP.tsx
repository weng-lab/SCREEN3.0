import { Box, Stack } from "@mui/system";
import { BarData, BarPlot, Point, ScatterPlot } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { Assay, BiosampleRow, formatAssay } from "./BiosampleActivity";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { gql } from "types/generated";
import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { scaleLinear } from "@visx/scale";
import {
  interpolateOranges,
  interpolateOrRd,
  interpolateRdGy,
  interpolateRdYlBu,
  interpolateReds,
} from "d3-scale-chromatic";
import { assayColors } from "app/_biosampleTables/helpers";
import { metadata } from "app/layout";
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
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

  const handleColorChange = (e: SelectChangeEvent<"score" | "organ/tissue" | "sampleType">) => {
    setColorScheme(e.target.value);
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
    return scaleLinear({
      domain: [1.639, 1.64, 4],
      range: ["#DDD", interpolateOrRd(0.33), interpolateOrRd(1)],
      clamp: true,
    });
  }, []);

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

  const Legend = useCallback(() => {
    switch (colorScheme) {
      case "score":
        return (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <LegendItem margin="0 5px">
              <svg width={10} height={10}>
                <rect fill={colorScale(-2)} width={10} height={10} />
              </svg>
              <Typography variant="caption" align="left" margin="0 0 0 4px">
                {"< 1.64"}
              </Typography>
            </LegendItem>
            <LegendItem margin="0 5px">
              <svg width={10} height={10}>
                <rect fill={colorScale(1.64)} width={10} height={10} />
              </svg>
              <Typography variant="caption" margin="0 0 0 4px">
                {"1.64"}
              </Typography>
            </LegendItem>
            <LegendItem margin="0 5px">
              <svg width={10} height={10}>
                <rect fill={colorScale(3)} width={10} height={10} />
              </svg>
              <Typography variant="caption" margin="0 0 0 4px">
                {"3"}
              </Typography>
            </LegendItem>
            <LegendItem margin="0 5px">
              <svg width={10} height={10}>
                <rect fill={colorScale(4)} width={10} height={10} />
              </svg>
              <Typography variant="caption" margin="0 0 0 4px">
                {"≥ 4"}
              </Typography>
            </LegendItem>
          </div>
        );
      case "organ/tissue":
        return;
      case "sampleType":
        return;
    }
  }, [colorScale, colorScheme]);

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <Stack direction={"row"}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Color By</InputLabel>
          <Select value={colorScheme} label="Color By" onChange={handleColorChange} size="small">
            <MenuItem value={"score"}>{formatAssay(assay)} Z Score</MenuItem>
            <MenuItem value={"organ/tissue"}>Organ/Tissue</MenuItem>
            <MenuItem value={"sampleType"}>Sample Type</MenuItem>
          </Select>
        </FormControl>
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
