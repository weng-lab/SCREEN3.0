import { Box } from "@mui/system";
import { BarData, BarPlot } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { BiosampleRow, formatAssay } from "./BiosampleActivity";
import { useMemo } from "react";
import { Typography } from "@mui/material";
import AssayPlotControls from "./AssayPlotControls";

const AssayBarPlot = ({
  entity,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  viewBy,
  ref,
  setViewBy,

}: SharedAssayViewPlotProps) => {

  const plotData: BarData<BiosampleRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((row) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((x) => x.name === row.name);
      return {
        value: row[assay],
        id: row.name,
        category: capitalizeFirstLetter(row.ontology),
        label: truncateString(capitalizeFirstLetter(row.displayname), 25),
        color:
          (anySelected && isSelected) || !anySelected ? tissueColors[row.ontology] ?? tissueColors.missing : "#CCCCCC",
        metadata: row,
      };
    });
  }, [assay, selected, sortedFilteredData]);

  const handleBarClick = (bar: BarData<BiosampleRow>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x.name !== bar.metadata.name));
    } else setSelected([...selected, bar.metadata]);
  };

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
          <b>Classification:</b>{" "}
          {capitalizeFirstLetter(bar.metadata.class)}
        </Typography>
        <Typography variant="body2">
          <b>Z-Score</b>{" "}
          {bar.value.toFixed(2)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <AssayPlotControls
        viewBy={viewBy}
        setViewBy={setViewBy}
      />
      <BarPlot
        data={plotData}
        topAxisLabel={`${entity.entityID} ${formatAssay(assay)} z-scores`}
        cutoffNegativeValues
        onBarClicked={handleBarClick}
        TooltipContents={PlotTooltip}
        ref={ref}
        downloadFileName={`${assay}_bar_plot`}
      />
    </Box>
  );
};

export default AssayBarPlot;
