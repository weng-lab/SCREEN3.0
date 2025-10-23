import {
  TranscriptMetadata,
  SharedTranscriptExpressionPlotProps,
  TranscriptExpressionProps,
} from "./TranscriptExpression";
import { useMemo } from "react";
import { capitalizeFirstLetter, capitalizeWords, truncateString } from "common/utility";
import { Box, Typography } from "@mui/material";
import { tissueColors } from "common/colors";
import { BarPlot, BarData, BarPlotProps } from "@weng-lab/visualization";
import TranscriptPlotControls from "./TranscriptPlotControls";

export type TranscriptExpressionBarPlotProps = TranscriptExpressionProps &
  SharedTranscriptExpressionPlotProps &
  Partial<BarPlotProps<TranscriptMetadata>>;

const TranscriptExpressionBarPlot = ({
  setPeak,
  setViewBy,
  setScale,
  scale,
  viewBy,
  geneData,
  transcriptExpressionData,
  selected,
  setSelected,
  selectedPeak,
  sortedFilteredData,
  ref,
  ...rest
}: TranscriptExpressionBarPlotProps) => {
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

  const onBarClicked = (bar: BarData<TranscriptMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x !== bar.metadata));
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
        {...rest}
        onBarClicked={onBarClicked}
        data={plotData}
        topAxisLabel={`TSS Expression at ${selectedPeak} of ${geneData.data.name} (${scale === "log" ? "log₁₀RPM" : "RPM"})`}
        TooltipContents={PlotTooltip}
        ref={ref}
        downloadFileName={`${geneData.data.name}_TSS_bar_plot`}
      />
    </Box>
  );
};

export default TranscriptExpressionBarPlot;
