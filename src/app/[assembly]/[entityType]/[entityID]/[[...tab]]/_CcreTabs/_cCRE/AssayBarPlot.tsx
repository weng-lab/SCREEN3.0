import { Box } from "@mui/system";
import { BarData, BarPlot } from "@weng-lab/visualization";
import { capitalizeFirstLetter, truncateString } from "common/utils";
import { formatAssay } from "common/assays";
import { tissueColors } from "common/colors";
import { useCallback, useMemo } from "react";
import PlotTooltip from "common/components/PlotTooltip";
import AssayPlotControls from "./AssayPlotControls";
import { biosampleTooltip, type AssayBarPlotProps, type BiosampleRow } from "./types";

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
  // Read the score off `row.value` (baked in at assaySpecificRows) rather than
  // indexing by `assay`. `assay` updates synchronously on a tab switch, but
  // `sortedFilteredData` lags a render behind (it's grid-event state), so
  // `row[assay]` would be undefined for the previous assay's rows mid-transition.
  const plotData: BarData<BiosampleRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData
      .filter((row) => row.value != null)
      .map((row) => {
        const anySelected = selected.length > 0;
        const isSelected = selected.some((x) => getRowId(x) === getRowId(row));
        return {
          value: row.value as number,
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
  }, [selected, sortedFilteredData, getRowId]);

  const handleBarClick = (bar: BarData<BiosampleRow>) => {
    toggleSelection(bar.metadata);
  };

  const TooltipContents = useCallback(
    (bar: BarData<BiosampleRow>) => <PlotTooltip {...biosampleTooltip(bar.metadata, assay)} />,
    [assay]
  );

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
          TooltipContents={TooltipContents}
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
