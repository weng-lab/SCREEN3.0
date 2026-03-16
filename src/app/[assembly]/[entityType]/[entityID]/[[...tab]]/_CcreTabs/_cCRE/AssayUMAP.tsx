import { Box, Stack } from "@mui/system";
import { Point, ScatterPlot } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gql } from "common/types/generated";
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
import { interpolateRdYlBu } from "d3-scale-chromatic";
import UMAPLegend from "common/components/UMAPLegend";
import { formatAssay } from "common/utility";
import { CcreAssay } from "common/types/globalTypes";
import type { BiosampleRow, AssayUMAPProps } from "./types";

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

const MINIMAP_CONFIG = { position: { right: 50, bottom: 50 } };

const TooltipBody = ({ metaData, assay }: { metaData: BiosampleRow; assay: CcreAssay }) => {
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
        <b>{formatAssay(assay)}:</b> {metaData[assay].toFixed(2)}
      </Typography>
    </>
  );
};

const AssayUMAP = ({
  rows,
  assay,
  assembly,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  ref,
}: AssayUMAPProps) => {
  const [colorScheme, setColorScheme] = useState<"score" | "organ/tissue" | "sampleType">("score");
  const [scoreColorMode, setScoreColorMode] = useState<"active" | "all">("active");

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

  const handleColorSchemeChange = (e: SelectChangeEvent) => {
    setColorScheme(e.target.value as "score" | "organ/tissue" | "sampleType");
  };

  const handleScoreColorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScoreColorMode(e.target.value as "active" | "all");
  };

  const { data: data_umap, loading: loading_umap } = useQuery(BIOSAMPLE_UMAP, {
    variables: {
      assembly: assembly.toLowerCase(),
      assay,
    },
  });

  const colorScale = useMemo(() => {
    let scaleConfig: Partial<Omit<LinearScaleConfig<string>, "type">>;
    switch (scoreColorMode) {
      case "active":
        scaleConfig = {
          domain: [1.64, 1.65, 4],
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

  const scoreGradientConfig = useMemo(() => {
    switch (scoreColorMode) {
      case "active":
        return {
          minLabel: "1.65",
          maxLabel: "4",
          gradient: [colorScale(1.65), colorScale(4)].join(", "),
        };
      case "all":
        return {
          minLabel: "-4",
          maxLabel: "4",
          gradient: [colorScale(-4), colorScale(0), colorScale(4)].join(", "),
        };
    }
  }, [colorScale, scoreColorMode]);

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

    const isHighlighted = (x: BiosampleRow) => selected.some((y) => getRowId(y) === getRowId(x));

    return rows
      .map((x) => {
        const coords = data_umap.ccREBiosampleQuery.biosamples.find(
          (sample) => sample.name === getRowId(x)
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
      .sort((a, b) => {
        const aHighlighted = isHighlighted(a.metaData);
        const bHighlighted = isHighlighted(b.metaData);
        if (aHighlighted !== bHighlighted) return bHighlighted ? -1 : 1;
        return a.metaData[assay] - b.metaData[assay];
      });
  }, [rows, data_umap, colorScale, selected, getPointColor, assay, getRowId]);

  const handlePointClick = (point: Point<BiosampleRow>) => {
    toggleSelection(point.metaData);
  };

  const handleLassoSelect = (points: Point<BiosampleRow>[]) => {
    const newItems = points.map((x) => x.metaData);
    setSelected((prev) => {
      const alreadySelected = new Set(prev.map(getRowId));
      const toAdd = newItems.filter((item) => !alreadySelected.has(getRowId(item)));
      return [...prev, ...toAdd];
    });
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1}>
          <FormControl>
            <InputLabel>Color By</InputLabel>
            <Select value={colorScheme} label="Color By" onChange={handleColorSchemeChange} size="small">
              <MenuItem value="score">Z Score</MenuItem>
              <MenuItem value="organ/tissue">Organ/Tissue</MenuItem>
              <MenuItem value="sampleType">Sample Type</MenuItem>
            </Select>
          </FormControl>
          {colorScheme === "score" && (
            <FormControl>
              <RadioGroup value={scoreColorMode} onChange={handleScoreColorModeChange} row>
                <FormControlLabel value="active" control={<Radio />} label="Active Only" />
                <FormControlLabel value="all" control={<Radio />} label="All" />
              </RadioGroup>
            </FormControl>
          )}
        </Stack>
        <UMAPLegend
          colorScheme={colorScheme}
          scatterData={scatterData}
          gradientConfig={scoreGradientConfig}
          getTissue={(x) => x.ontology}
          getSampleType={(x) => x.sampleType}
        />
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
          pointData={scatterData}
          onPointClicked={handlePointClick}
          onSelectionChange={handleLassoSelect}
          leftAxisLabel="UMAP-2"
          bottomAxisLabel="UMAP-1"
          selectable
          loading={loading_umap}
          miniMap={MINIMAP_CONFIG}
          tooltipBody={(point) => <TooltipBody metaData={point.metaData} assay={assay} />}
          ref={ref}
          downloadFileName={`${assay}_UMAP`}
          animation="scale"
          animationBuffer={0.01}
          animationGroupSize={assay === "ctcf" ? 15 : assay === "dnase" ? 65 : 30}
        />
      </Box>
    </Box>
  );
};

export default AssayUMAP;
