import { useMemo, useState } from "react";
import { BarPlot, BarData } from "@weng-lab/visualization";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import type { MohdRnaSeqRow, MohdRnaSeqBarPlotProps, BarColorBy, MohdRnaSeqScale } from "./MohdRnaSeqTypes";
import { getCategoryColor, getScaledValue } from "./MohdRnaSeqTypes";

const PlotTooltip = ({ bar, scale }: { bar: BarData<MohdRnaSeqRow>; scale: MohdRnaSeqScale }) => (
  <div style={{ padding: 2, maxWidth: 350 }}>
    <Typography>
      <b>Sample:</b> {bar.metadata.sample_id}
    </Typography>
    <Typography variant="body2">
      <b>{scale === "linear" ? "TPM" : "Log\u2081\u2080(TPM + 1)"}:</b> {bar.value.toFixed(3)}
    </Typography>
    <Typography variant="body2">
      <b>Kit:</b> {bar.metadata.kit}
    </Typography>
    <Typography variant="body2">
      <b>Site:</b> {bar.metadata.site}
    </Typography>
    <Typography variant="body2">
      <b>Status:</b> {bar.metadata.status}
    </Typography>
  </div>
);

const MohdRnaSeqBarPlot = ({
  sortedFilteredData,
  selected,
  toggleSelection,
  getRowId,
  scale,
  setScale,
  topAxisLabel,
  ref,
}: MohdRnaSeqBarPlotProps) => {
  const [colorBy, setColorBy] = useState<BarColorBy>("site");

  const plotData: BarData<MohdRnaSeqRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: x[colorBy],
        label: `${getScaledValue(x, scale).toFixed(2)}, ${x.sample_id}`,
        value: getScaledValue(x, scale),
        color: (anySelected && isSelected) || !anySelected ? getCategoryColor(x, colorBy) : "#CCCCCC",
        id: getRowId(x),
        metadata: x,
      };
    });
  }, [sortedFilteredData, selected, getRowId, colorBy, scale]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Stack direction="row" spacing={1} sx={{ px: 1, pt: 1 }} alignItems="center">
        <FormControl size="small">
          <InputLabel>Color By</InputLabel>
          <Select
            value={colorBy}
            label="Color By"
            onChange={(e: SelectChangeEvent) => setColorBy(e.target.value as BarColorBy)}
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
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          data={plotData}
          onBarClicked={(bar) => toggleSelection(bar.metadata)}
          topAxisLabel={topAxisLabel}
          TooltipContents={(bar) => <PlotTooltip bar={bar} scale={scale} />}
          ref={ref}
          downloadFileName="mohd_rna_seq_bar_plot"
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default MohdRnaSeqBarPlot;
