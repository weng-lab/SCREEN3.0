import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Stack } from "@mui/system";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Point, ScatterPlot } from "@weng-lab/visualization";
import { scaleLinear } from "@visx/scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type { MohdRnaSeqRow, MohdRnaSeqUMAPProps, UmapColorBy } from "./MohdRnaSeqTypes";
import { getCategoryColor, colorMaps } from "./MohdRnaSeqTypes";

const TooltipBody = ({ metaData }: { metaData: MohdRnaSeqRow }) => (
  <>
    <Typography><b>Sample:</b> {metaData.sample_id}</Typography>
    <Typography variant="body2"><b>TPM:</b> {metaData.value.toFixed(2)}</Typography>
    <Typography variant="body2"><b>Log₁₀(TPM + 1):</b> {Math.log10(metaData.value + 1).toFixed(2)}</Typography>
    <Typography variant="body2"><b>Kit:</b> {metaData.kit}</Typography>
    <Typography variant="body2"><b>Sex:</b> {metaData.sex}</Typography>
    <Typography variant="body2"><b>Site:</b> {metaData.site}</Typography>
    <Typography variant="body2"><b>Status:</b> {metaData.status}</Typography>
  </>
);

const CONTROLS_OFFSET = 65;

const MohdRnaSeqUMAP = ({
  rows,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  loading,
  ref,
}: MohdRnaSeqUMAPProps) => {
  const [colorBy, setColorBy] = useState<UmapColorBy>("expression");

  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotContainerWidth, setPlotContainerWidth] = useState(0);
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setPlotContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // UMAP always uses log-transformed TPM: log10(TPM + 1)
  // Color scale matches GeneExpressionUMAP: 9-step YlOrRd interpolation from 0 to max
  const maxLogValue = useMemo(() => {
    if (!rows.length) return 0;
    return Math.max(...rows.map((r) => Math.log10(r.value + 1)));
  }, [rows]);

  const generateDomain = (max: number, steps: number) =>
    Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * max);

  const colorScale = useMemo(
    () =>
      scaleLinear({
        domain: generateDomain(maxLogValue, 9),
        range: Array.from({ length: 9 }, (_, i) => i / 8),
        clamp: true,
      }),
    [maxLogValue]
  );

  const gradientConfig = useMemo(() => {
    const stops = generateDomain(maxLogValue, 9).map((value) => interpolateYlOrRd(colorScale(value)));
    return {
      minLabel: "0",
      maxLabel: maxLogValue.toFixed(2),
      gradient: `#808080, ${stops.join(", ")}`,
    };
  }, [maxLogValue, colorScale]);

  const getPointColor = useCallback(
    (row: MohdRnaSeqRow) => {
      if (colorBy === "expression") return interpolateYlOrRd(colorScale(Math.log10(row.value + 1)));
      return getCategoryColor(row, colorBy);
    },
    [colorBy, colorScale]
  );

  const scatterData: Point<MohdRnaSeqRow>[] = useMemo(() => {
    if (!rows) return [];

    const isHighlighted = (x: MohdRnaSeqRow) => selected.some((y) => getRowId(y) === getRowId(x));

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

  const handlePointClick = (point: Point<MohdRnaSeqRow>) => {
    toggleSelection(point.metaData);
  };

  const handleLassoSelect = (points: Point<MohdRnaSeqRow>[]) => {
    const newItems = points.map((x) => x.metaData);
    setSelected((prev) => {
      const alreadySelected = new Set(prev.map(getRowId));
      const toAdd = newItems.filter((item) => !alreadySelected.has(getRowId(item)));
      return [...prev, ...toAdd];
    });
  };

  const legendEntries = useMemo(() => {
    if (colorBy === "expression") return null;
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
        <FormControl size="small">
          <InputLabel>Color By</InputLabel>
          <Select
            value={colorBy}
            label="Color By"
            onChange={(e: SelectChangeEvent) => setColorBy(e.target.value as UmapColorBy)}
          >
            <MenuItem value="expression">Expression</MenuItem>
            <MenuItem value="sex">Sex</MenuItem>
            <MenuItem value="site">Site</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        {/* Legend */}
        {colorBy === "expression" && gradientConfig ? (
          <Stack direction="row" spacing={0.5} alignItems="center" mr={1}>
            <Typography>Log₁₀(TPM + 1)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
              <Typography sx={{ mr: 1 }}>{gradientConfig.minLabel}</Typography>
              <Box
                sx={{
                  height: "14px",
                  flexGrow: 1,
                  background: `linear-gradient(to right, ${gradientConfig.gradient})`,
                }}
              />
              <Typography sx={{ ml: 1 }}>{gradientConfig.maxLabel}</Typography>
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
          downloadFileName="mohd_rna_seq_umap"
          animation="scale"
          animationBuffer={0.01}
          animationGroupSize={30}
        />
      </Box>
    </Box>
  );
};

export default MohdRnaSeqUMAP;
