import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack } from "@mui/system";
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
import { Point, ScatterPlot } from "@weng-lab/visualization";
import { LinearScaleConfig, scaleLinear } from "@visx/scale";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import type { MohdAtacRow, MohdAtacUMAPProps, UmapColorBy, ScoreColorMode } from "./MohdAtacTypes";
import { getCategoryColor, colorMaps } from "./MohdAtacTypes";

const TooltipBody = ({ metaData }: { metaData: MohdAtacRow }) => (
  <>
    <Typography>
      <b>Sample:</b> {metaData.sample_id}
    </Typography>
    <Typography variant="body2">
      <b>Z-Score:</b> {metaData.value.toFixed(2)}
    </Typography>
    <Typography variant="body2">
      <b>Protocol:</b> {metaData.protocol}
    </Typography>
    <Typography variant="body2">
      <b>Sex:</b> {metaData.sex}
    </Typography>
    <Typography variant="body2">
      <b>Site:</b> {metaData.site}
    </Typography>
    <Typography variant="body2">
      <b>Status:</b> {metaData.status}
    </Typography>
  </>
);

const CONTROLS_OFFSET = 65;

const MohdAtacUMAP = ({ rows, selected, setSelected, toggleSelection, getRowId, loading, ref }: MohdAtacUMAPProps) => {
  const [colorBy, setColorBy] = useState<UmapColorBy>("zscore");
  const [scoreColorMode, setScoreColorMode] = useState<ScoreColorMode>("active");

  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotContainerWidth, setPlotContainerWidth] = useState(0);
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setPlotContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    return scaleLinear({ ...scaleConfig, clamp: true });
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
    (row: MohdAtacRow) => {
      if (colorBy === "zscore") return colorScale(row.value);
      return getCategoryColor(row, colorBy);
    },
    [colorBy, colorScale]
  );

  const scatterData: Point<MohdAtacRow>[] = useMemo(() => {
    if (!rows) return [];

    const isHighlighted = (x: MohdAtacRow) => selected.some((y) => getRowId(y) === getRowId(x));

    return rows
      .map((x) => ({
        x: x.umap_x,
        y: x.umap_y,
        shape: "circle" as const,
        r: isHighlighted(x) ? 4 : 2,
        color: isHighlighted(x) || selected.length === 0 ? getPointColor(x) : "#CCCCCC",
        metaData: x,
      }))
      .sort((a, b) => {
        const aH = isHighlighted(a.metaData);
        const bH = isHighlighted(b.metaData);
        if (aH !== bH) return bH ? -1 : 1;
        return a.metaData.value - b.metaData.value;
      });
  }, [rows, selected, getPointColor, getRowId]);

  const handlePointClick = (point: Point<MohdAtacRow>) => {
    toggleSelection(point.metaData);
  };

  const handleLassoSelect = (points: Point<MohdAtacRow>[]) => {
    const newItems = points.map((x) => x.metaData);
    setSelected((prev) => {
      const alreadySelected = new Set(prev.map(getRowId));
      const toAdd = newItems.filter((item) => !alreadySelected.has(getRowId(item)));
      return [...prev, ...toAdd];
    });
  };

  // Build categorical legend entries
  const legendEntries = useMemo(() => {
    if (colorBy === "zscore") return null;
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const key = r[colorBy];
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const colors = colorMaps[colorBy];
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({
        label,
        color: colors[label] ?? "#999999",
        count,
      }));
  }, [rows, colorBy]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1, pt: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small">
            <InputLabel>Color By</InputLabel>
            <Select
              value={colorBy}
              label="Color By"
              onChange={(e: SelectChangeEvent) => setColorBy(e.target.value as UmapColorBy)}
            >
              <MenuItem value="zscore">Z-Score</MenuItem>
              <MenuItem value="protocol">Protocol</MenuItem>
              <MenuItem value="sex">Sex</MenuItem>
              <MenuItem value="site">Site</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
          {colorBy === "zscore" && (
            <FormControl>
              <RadioGroup
                value={scoreColorMode}
                onChange={(e) => setScoreColorMode(e.target.value as ScoreColorMode)}
                row
              >
                <FormControlLabel value="active" control={<Radio size="small" />} label="Active Only" />
                <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
              </RadioGroup>
            </FormControl>
          )}
        </Stack>
        {/* Legend */}
        {colorBy === "zscore" && scoreGradientConfig ? (
          <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
            <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
              <Typography sx={{ mr: 1 }}>{scoreGradientConfig.minLabel}</Typography>
              <Box
                sx={{
                  height: "14px",
                  flexGrow: 1,
                  background: `linear-gradient(to right, ${scoreGradientConfig.gradient})`,
                }}
              />
              <Typography sx={{ ml: 1 }}>{scoreGradientConfig.maxLabel}</Typography>
            </Box>
          </Stack>
        ) : legendEntries ? (
          <Stack direction="row" spacing={1} alignItems="center" mr={1} flexWrap="wrap">
            {legendEntries.map((entry) => (
              <Box key={entry.label} sx={{ display: "flex", alignItems: "center" }}>
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
          </Stack>
        ) : null}
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
          loading={loading}
          tooltipBody={(point) => <TooltipBody metaData={point.metaData} />}
          ref={ref}
          downloadFileName="mohd_atac_umap"
          animation="scale"
          animationBuffer={0.01}
          animationGroupSize={30}
        />
      </Box>
    </Box>
  );
};

export default MohdAtacUMAP;
