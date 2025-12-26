import {
  TranscriptMetadata,
  SharedTranscriptExpressionPlotProps,
} from "./TranscriptExpression";
import { useMemo } from "react";
// import { capitalizeFirstLetter, capitalizeWords, truncateString } from "common/utility";
export function capitalizeWords(input: string): string {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const truncateString = (input: string, maxLength: number) => {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + "...";
};
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
  entity,
  transcriptExpressionData,
  selected,
  setSelected,
  selectedPeak,
  sortedFilteredData,
  ref,
  ...rest
}: SharedTranscriptExpressionPlotProps) => {
  const plotData: BarData<TranscriptMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => y.expAccession === x.expAccession);
      return {
        category: capitalizeWords(x.organ),
        label: capitalizeFirstLetter(truncateString(x.biosampleSummary, 20)),
        value: x.value,
        color:
          (anySelected && isSelected) || !anySelected ? (tissueColors[x.organ] ?? tissueColors.missing) : "#CCCCCC",
        metadata: x,
        id: i.toString(),
      };
    });
  }, [sortedFilteredData, selected]);

  const handleBarClick = (bar: BarData<TranscriptMetadata>) => {
    if (selected.some((x) => x.expAccession === bar.metadata.expAccession)) {
      setSelected(selected.filter((x) => x.expAccession !== bar.metadata.expAccession));
    } else setSelected([...selected, bar.metadata]);
  };

  const PlotTooltip = (bar: BarData<TranscriptMetadata>) => {
    return (
      <>
        <Typography variant="body2">
          <b>Sample:</b> {capitalizeWords(bar.metadata.biosampleSummary.replaceAll("_", " "))}
        </Typography>
        <Typography variant="body2">
          <b>Tissue:</b> {capitalizeWords(bar.metadata.organ)}
        </Typography>
        <Typography variant="body2">
          <b>Strand:</b> {capitalizeWords(bar.metadata.strand)}
        </Typography>
        <Typography variant="body2">
          <b>RPM:</b> {bar.value.toFixed(2)}
        </Typography>
      </>
    );
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <TranscriptPlotControls
        setViewBy={setViewBy}
        setPeak={setPeak}
        setScale={setScale}
        scale={scale}
        viewBy={viewBy}
        transcriptExpressionData={transcriptExpressionData}
        selectedPeak={selectedPeak}
      />
      <BarPlot
        onBarClicked={handleBarClick}
        data={plotData}
        topAxisLabel={`TSS Expression at ${selectedPeak} of ${entity.entityID} - ${scale === "log" ? "log₁₀(RPM + 1)" : "RPM"}`}
        TooltipContents={PlotTooltip}
        ref={ref}
        downloadFileName={`${entity.entityID}_TSS_bar_plot`}
        animation="slideRight"
        animationBuffer={0.01}
      />
    </Box>
  );
};

export default TranscriptExpressionBarPlot;
