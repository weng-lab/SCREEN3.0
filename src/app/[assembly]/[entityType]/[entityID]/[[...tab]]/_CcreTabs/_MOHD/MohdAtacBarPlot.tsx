import { useMemo, useState } from "react";
import { BarPlot, BarData, DownloadPlotHandle } from "@weng-lab/visualization";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import type { MohdAtacRow, MohdAtacBarPlotProps, BarColorBy } from "./MohdAtacTypes";
import { getCategoryColor } from "./MohdAtacTypes";

const PlotTooltip = (bar: BarData<MohdAtacRow>) => (
  <div style={{ padding: 2, maxWidth: 350 }}>
    <Typography><b>Sample:</b> {bar.metadata.sample_id}</Typography>
    <Typography variant="body2">Z-Score: {bar.metadata.value.toFixed(3)}</Typography>
    <Typography variant="body2">Protocol: {bar.metadata.protocol}</Typography>
    <Typography variant="body2">Site: {bar.metadata.site}</Typography>
    <Typography variant="body2">Status: {bar.metadata.status}</Typography>
  </div>
);

const MohdAtacBarPlot = ({
  sortedFilteredData,
  selected,
  toggleSelection,
  getRowId,
  ref,
}: MohdAtacBarPlotProps) => {
  const [colorBy, setColorBy] = useState<BarColorBy>("protocol");

  const plotData: BarData<MohdAtacRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: x[colorBy],
        label: `${x.value.toFixed(2)}, ${x.sample_id}`,
        value: x.value,
        color: (anySelected && isSelected) || !anySelected ? getCategoryColor(x, colorBy) : "#CCCCCC",
        id: getRowId(x),
        metadata: x,
      };
    });
  }, [sortedFilteredData, selected, getRowId, colorBy]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box sx={{ px: 1, pt: 1 }}>
        <FormControl size="small">
          <InputLabel>Color By</InputLabel>
          <Select
            value={colorBy}
            label="Color By"
            onChange={(e: SelectChangeEvent) => setColorBy(e.target.value as BarColorBy)}
          >
            <MenuItem value="protocol">Protocol</MenuItem>
            <MenuItem value="sex">Sex</MenuItem>
            <MenuItem value="site">Site</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          data={plotData}
          onBarClicked={(bar) => toggleSelection(bar.metadata)}
          topAxisLabel="Z-Score"
          TooltipContents={PlotTooltip}
          ref={ref}
          downloadFileName="mohd_atac_bar_plot"
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default MohdAtacBarPlot;
