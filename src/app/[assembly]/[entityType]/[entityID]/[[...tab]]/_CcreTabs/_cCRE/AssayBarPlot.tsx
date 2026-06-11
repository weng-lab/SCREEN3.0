import { Box } from "@mui/system";
import { BarData, BarPlot } from "@weng-lab/visualization";
import { capitalizeFirstLetter, formatAssay, truncateString } from "common/utility";
import { tissueColors } from "common/colors";
import { useMemo } from "react";
import { Typography } from "@mui/material";
import AssayPlotControls from "./AssayPlotControls";
import type { AssayBarPlotProps, BiosampleRow } from "./types";

const PlotTooltip = (bar: BarData<BiosampleRow>) => {
  return (
    <Box maxWidth={350}>
      <Typography variant="body2">
        <b>Sample:</b> {capitalizeFirstLetter(bar.metadata.displayname)}
      </Typography>
      <Typography variant="body2">
        <b>Tissue:</b> {capitalizeFirstLetter(bar.metadata.ontology)}
      </Typography>
      <Typography variant="body2">
        <b>Classification:</b> {capitalizeFirstLetter(bar.metadata.group)}
      </Typography>
      <Typography variant="body2">
        <b>Z-Score</b> {bar.value.toFixed(2)}
      </Typography>
    </Box>
  );
};

const AssayBarPlot = ({
  sortedFilteredData,
  selected,
  toggleSelection,
  getRowId,
  assay,
  entityID,
  viewBy,
  setViewBy,
  cutoffLowSignal,
  setCutoffLowSignal,
  show95Line,
  setShow95Line,
  ref,
}: AssayBarPlotProps) => {
  const plotData: BarData<BiosampleRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((row) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((x) => getRowId(x) === getRowId(row));
      return {
        value: row[assay],
        id: getRowId(row),
        category: capitalizeFirstLetter(row.ontology),
        label: truncateString(capitalizeFirstLetter(row.displayname), 25),
        color:
          (anySelected && isSelected) || !anySelected
            ? (tissueColors[row.ontology] ?? tissueColors.missing)
            : "#CCCCCC",
        metadata: row,
      };
    });
  }, [assay, selected, sortedFilteredData, getRowId]);

  const handleBarClick = (bar: BarData<BiosampleRow>) => {
    toggleSelection(bar.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <AssayPlotControls
        viewBy={viewBy}
        setViewBy={setViewBy}
        cutoffLowSignal={cutoffLowSignal}
        setCutoffLowSignal={setCutoffLowSignal}
        show95Line={show95Line}
        setShow95Line={setShow95Line}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          data={plotData}
          topAxisLabel={`${entityID} ${formatAssay(assay)} z-scores`}
          cutoffNegativeValues={cutoffLowSignal}
          show95thPercentileLine={show95Line}
          onBarClicked={handleBarClick}
          TooltipContents={PlotTooltip}
          ref={ref}
          downloadFileName={`${assay}_bar_plot`}
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default AssayBarPlot;
