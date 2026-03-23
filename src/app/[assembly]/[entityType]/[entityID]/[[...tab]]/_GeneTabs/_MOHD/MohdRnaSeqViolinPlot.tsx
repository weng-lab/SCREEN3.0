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
import type { MohdRnaSeqRow, MohdRnaSeqViolinPlotProps, BarColorBy, MohdRnaSeqScale } from "./MohdRnaSeqTypes";
import { colorMaps, getScaledValue } from "./MohdRnaSeqTypes";

const SmallFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  "& .MuiFormControlLabel-label": {
    fontSize: theme.typography.body2.fontSize,
  },
}));

const MohdRnaSeqViolinPlot = ({
  rows,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  scale,
  setScale,
  ref,
}: MohdRnaSeqViolinPlotProps) => {
  const [groupBy, setGroupBy] = useState<BarColorBy>("site");
  const [sortBy, setSortBy] = useState<ViolinSortBy>("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const violinData: Distribution<MohdRnaSeqRow>[] = useMemo(() => {
    if (!rows?.length) return [];

    const groups = rows.reduce(
      (acc, item) => {
        const key = item[groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, MohdRnaSeqRow[]>
    );

    const colors = colorMaps[groupBy];

    const distributions = Object.entries(groups).map(([category, group]) => {
      const noneSelected = selected.length === 0;
      const allInGroupSelected = group.every((d) => selected.some((s) => getRowId(s) === getRowId(d)));

      const violinColor = noneSelected || allInGroupSelected ? (colors[category] ?? "#999999") : "#CCCCCC";

      const data: ViolinPoint<MohdRnaSeqRow>[] = group.map((sample) => {
        const isSelected = noneSelected || selected.some((s) => getRowId(s) === getRowId(sample));
        return {
          value: getScaledValue(sample, scale),
          radius: isSelected && !noneSelected ? 4 : 2,
          color: isSelected ? (colors[category] ?? "#999999") : "#CCCCCC",
          metadata: sample,
        };
      });

      return { label: category, data, violinColor };
    });

    sortDistributions(distributions, sortBy);
    return distributions;
  }, [rows, selected, getRowId, sortBy, groupBy, scale]);

  const onViolinClicked = (distribution: Distribution<MohdRnaSeqRow>) => {
    handleViolinToggle(distribution, selected, setSelected, getRowId);
  };

  const onPointClicked = (point: ViolinPoint<MohdRnaSeqRow>) => {
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
            <MenuItem value="sex">Sex</MenuItem>
            <MenuItem value="site">Site</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Scale</InputLabel>
          <Select
            value={scale}
            label="Scale"
            onChange={(e: SelectChangeEvent) => setScale(e.target.value as MohdRnaSeqScale)}
          >
            <MenuItem value="linear">Linear</MenuItem>
            <MenuItem value="log">Log₁₀(TPM + 1)</MenuItem>
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
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <ViolinPlot
          distributions={violinData}
          axisLabel={scale === "linear" ? "TPM" : "Log\u2081\u2080(TPM + 1)"}
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
          animation="slideUp"
          animationBuffer={0.01}
          ref={ref}
          downloadFileName="mohd_rna_seq_violin_plot"
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
                <strong>{scale === "linear" ? "TPM" : "Log\u2081\u2080(TPM + 1)"}:</strong> {point.value.toFixed(2)}
              </div>
              <div>
                <strong>Kit:</strong> {point.metadata?.kit}
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

export default MohdRnaSeqViolinPlot;
