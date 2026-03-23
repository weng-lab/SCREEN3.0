import { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
} from "@mui/material";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { sortDistributions, handleViolinToggle, type ViolinSortBy } from "common/violinUtils";
import type { MohdAtacRow, MohdAtacViolinPlotProps, BarColorBy } from "./MohdAtacTypes";
import { colorMaps } from "./MohdAtacTypes";

const SmallFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: theme.typography.body2.fontSize,
  },
}));

const MohdAtacViolinPlot = ({
  rows,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  ref,
}: MohdAtacViolinPlotProps) => {
  const [groupBy, setGroupBy] = useState<BarColorBy>("protocol");
  const [sortBy, setSortBy] = useState<ViolinSortBy>("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);
  const [cutoffLowZScores, setCutoffLowZScores] = useState<boolean>(true);
  const [show95Line, setShow95Line] = useState<boolean>(true);

  const violinData: Distribution<MohdAtacRow>[] = useMemo(() => {
    if (!rows?.length) return [];

    const groups = rows.reduce(
      (acc, item) => {
        const key = item[groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, MohdAtacRow[]>
    );

    const colors = colorMaps[groupBy];

    const distributions = Object.entries(groups).map(([category, group]) => {
      const label = groupBy === "protocol" ? category.replace(" method", "") : category;

      const noneSelected = selected.length === 0;
      const allInGroupSelected = group.every((d) => selected.some((s) => getRowId(s) === getRowId(d)));

      const violinColor = noneSelected || allInGroupSelected ? (colors[category] ?? "#999999") : "#CCCCCC";

      const data: ViolinPoint<MohdAtacRow>[] = group.map((sample) => {
        const isSelected = noneSelected || selected.some((s) => getRowId(s) === getRowId(sample));
        return {
          value: sample.value,
          radius: isSelected && !noneSelected ? 4 : 2,
          color: isSelected ? (colors[category] ?? "#999999") : "#CCCCCC",
          metadata: sample,
        };
      });

      return { label, data, violinColor };
    });

    sortDistributions(distributions, sortBy);
    return distributions;
  }, [rows, selected, getRowId, sortBy, groupBy]);

  const onViolinClicked = (distribution: Distribution<MohdAtacRow>) => {
    handleViolinToggle(distribution, selected, setSelected, getRowId);
  };

  const onPointClicked = (point: ViolinPoint<MohdAtacRow>) => {
    toggleSelection(point.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} sx={{ px: 1, pt: 1 }} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Group By</InputLabel>
          <Select
            value={groupBy}
            label="Group By"
            onChange={(e: SelectChangeEvent) => setGroupBy(e.target.value as BarColorBy)}
          >
            <MenuItem value="protocol">Protocol</MenuItem>
            <MenuItem value="sex">Sex</MenuItem>
            <MenuItem value="site">Site</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e: SelectChangeEvent) => setSortBy(e.target.value as ViolinSortBy)}
          >
            <MenuItem value="max">Max</MenuItem>
            <MenuItem value="median">Median</MenuItem>
            <MenuItem value="tissue">A-Z</MenuItem>
          </Select>
        </FormControl>
        <SmallFormControlLabel
          control={<Checkbox checked={showPoints} onChange={(_, checked) => setShowPoints(checked)} size="small" />}
          label="Show Points"
        />
        <SmallFormControlLabel
          control={
            <Checkbox checked={cutoffLowZScores} onChange={(_, checked) => setCutoffLowZScores(checked)} size="small" />
          }
          label="Hide Low Z-Scores"
        />
        <SmallFormControlLabel
          control={<Checkbox checked={show95Line} onChange={(_, checked) => setShow95Line(checked)} size="small" />}
          label="95th Percentile Line"
        />
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <ViolinPlot
          distributions={violinData}
          axisLabel="ATAC Z-Score"
          loading={!violinData.length}
          onViolinClicked={onViolinClicked}
          onPointClicked={onPointClicked}
          labelOrientation="leftDiagonal"
          violinProps={{
            bandwidth: "scott",
            showAllPoints: showPoints,
            jitter: 10,
          }}
          crossProps={{
            outliers: showPoints ? "all" : "none",
          }}
          cutoffValue={cutoffLowZScores ? -0.5 : undefined}
          show95thPercentileLine={show95Line}
          animation="slideUp"
          animationBuffer={0.01}
          ref={ref}
          downloadFileName="mohd_atac_violin_plot"
          pointTooltipBody={(point) => (
            <Box maxWidth={300}>
              {point.outlier && (
                <div>
                  <strong>Outlier</strong>
                </div>
              )}
              <div>
                <strong>Sample:</strong> {point.metadata?.sample_id}
              </div>
              <div>
                <strong>Z-Score:</strong> {point.metadata?.value.toFixed(2)}
              </div>
              <div>
                <strong>Protocol:</strong> {point.metadata?.protocol}
              </div>
              <div>
                <strong>Sex:</strong> {point.metadata?.sex}
              </div>
              <div>
                <strong>Site:</strong> {point.metadata?.site}
              </div>
              <div>
                <strong>Status:</strong> {point.metadata?.status}
              </div>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default MohdAtacViolinPlot;
