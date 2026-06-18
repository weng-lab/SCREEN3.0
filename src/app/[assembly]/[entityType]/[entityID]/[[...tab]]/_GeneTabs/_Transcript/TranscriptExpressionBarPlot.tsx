import type { TranscriptMetadata, TranscriptExpressionBarPlotProps } from "./types";
import { getScaledRPM } from "./types";
import { useCallback, useMemo } from "react";
import { capitalizeWords, capitalizeFirstLetter, truncateString } from "common/utils";
import { Box, Typography } from "@mui/material";
import { tissueColors } from "common/colors";
import { BarPlot, BarData } from "@weng-lab/visualization";
import TranscriptPlotControls from "./TranscriptPlotControls";

const TranscriptExpressionBarPlot = ({
  setPeak,
  setViewBy,
  setScale,
  scale,
  viewBy,
  geneName,
  transcriptExpressionData,
  selected,
  toggleSelection,
  getRowId,
  selectedPeak,
  sortedFilteredData,
  ref,
}: TranscriptExpressionBarPlotProps) => {
  const plotData: BarData<TranscriptMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: capitalizeWords(x.organ),
        label: `${getScaledRPM(x, scale).toFixed(2)}, ${capitalizeFirstLetter(truncateString(x.biosampleSummary.replaceAll("_", " "), 20))} (${x.expAccession})`,
        value: getScaledRPM(x, scale),
        color:
          (anySelected && isSelected) || !anySelected ? (tissueColors[x.organ] ?? tissueColors.missing) : "#CCCCCC",
        metadata: x,
        id: getRowId(x),
      };
    });
  }, [sortedFilteredData, selected, scale, getRowId]);

  const handleBarClick = (bar: BarData<TranscriptMetadata>) => {
    toggleSelection(bar.metadata);
  };

  const PlotTooltip = useCallback(
    (bar: BarData<TranscriptMetadata>) => (
      <Box maxWidth={300}>
        <Typography variant="body2">
          <b>Sample:</b> {capitalizeWords(bar.metadata.biosampleSummary.replaceAll("_", " "))}
        </Typography>
        <Typography variant="body2">
          <b>Tissue:</b> {capitalizeWords(bar.metadata.organ)}
        </Typography>
        <Typography variant="body2">
          <b>Sample Type:</b> {capitalizeWords(bar.metadata.biosampleType)}
        </Typography>
        <Typography variant="body2">
          <b>Strand:</b> {capitalizeWords(bar.metadata.strand)}
        </Typography>
        {scale === "linear" ? (
          <Typography variant="body2">
            <b>RPM:</b> {bar.value.toFixed(2)}
          </Typography>
        ) : (
          <Typography variant="body2">
            <b>
              Log<sub>10</sub>(RPM + 1):
            </b>{" "}
            {bar.value.toFixed(2)}
          </Typography>
        )}
      </Box>
    ),
    [scale]
  );

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <TranscriptPlotControls
        setViewBy={setViewBy}
        setPeak={setPeak}
        setScale={setScale}
        scale={scale}
        viewBy={viewBy}
        transcriptExpressionData={transcriptExpressionData}
        selectedPeak={selectedPeak}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          onBarClicked={handleBarClick}
          data={plotData}
          topAxisLabel={`TSS Expression at ${selectedPeak} of ${geneName} - ${scale === "log" ? "log₁₀(RPM + 1)" : "RPM"}`}
          TooltipContents={PlotTooltip}
          ref={ref}
          downloadFileName={`${geneName}_TSS_bar_plot`}
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default TranscriptExpressionBarPlot;
