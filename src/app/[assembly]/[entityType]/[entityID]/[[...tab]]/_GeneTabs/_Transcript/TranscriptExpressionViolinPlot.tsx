import type { TranscriptMetadata, TranscriptExpressionViolinPlotProps } from "./types";
import { getScaledRPM } from "./types";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import { sortDistributions, handleViolinToggle, type ViolinSortBy } from "common/utils";
import TranscriptPlotControls from "./TranscriptPlotControls";

const TranscriptExpressionViolinPlot = ({
  setViewBy,
  setPeak,
  setScale,
  setSelected,
  scale,
  viewBy,
  geneName,
  selectedPeak,
  transcriptExpressionData,
  selected,
  toggleSelection,
  getRowId,
  rows,
  ref,
}: TranscriptExpressionViolinPlotProps) => {
  const [sortBy, setSortBy] = useState<ViolinSortBy>("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const violinData: Distribution<TranscriptMetadata>[] = useMemo(() => {
    if (!rows) return [];

    const grouped = rows.reduce(
      (acc, item) => {
        const key = item.organ;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, TranscriptMetadata[]>
    );

    const distributions = Object.entries(grouped).map(([tissue, group]) => {
      const noneSelected = selected.length === 0;
      const allInViolinSelected = group.every((d) => selected.some((s) => getRowId(s) === getRowId(d)));

      const violinColor =
        noneSelected || allInViolinSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";

      const data: ViolinPoint<TranscriptMetadata>[] = group.map((sample) => {
        const isSelected = noneSelected || selected.some((s) => getRowId(s) === getRowId(sample));
        const pointColor = isSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return {
          value: getScaledRPM(sample, scale),
          radius: pointRadius,
          tissue,
          metadata: sample,
          color: pointColor,
        };
      });

      return { label: tissue, data, violinColor };
    });

    sortDistributions(distributions, sortBy);

    return distributions;
  }, [selected, rows, sortBy, scale, getRowId]);

  const onViolinClicked = (distribution: Distribution<TranscriptMetadata>) => {
    handleViolinToggle(distribution, selected, setSelected, getRowId);
  };

  const onPointClicked = (point: ViolinPoint<TranscriptMetadata>) => {
    toggleSelection(point.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <TranscriptPlotControls
        setViewBy={setViewBy}
        setPeak={setPeak}
        setScale={setScale}
        setSortBy={setSortBy}
        setShowPoints={setShowPoints}
        showPoints={showPoints}
        scale={scale}
        viewBy={viewBy}
        sortBy={sortBy}
        transcriptExpressionData={transcriptExpressionData}
        selectedPeak={selectedPeak}
        violin={true}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <ViolinPlot
          distributions={violinData}
          axisLabel={`TSS Expression at ${selectedPeak} of ${geneName} (${scale === "log" ? "log₁₀RPM" : "RPM"})`}
          loading={transcriptExpressionData.loading}
          labelOrientation="leftDiagonal"
          onViolinClicked={onViolinClicked}
          onPointClicked={onPointClicked}
          violinProps={{
            bandwidth: "scott",
            showAllPoints: showPoints,
            jitter: 10,
          }}
          animation="slideUp"
          animationBuffer={0.01}
          crossProps={{
            outliers: showPoints ? "all" : "none",
          }}
          ref={ref}
          downloadFileName={`${geneName}_TSS_violin_plot`}
          pointTooltipBody={(point) => (
            <Box maxWidth={300}>
              {point.outlier && (
                <div>
                  <strong>Outlier</strong>
                </div>
              )}
              <div>
                <strong>Sample:</strong> {point.metadata?.biosampleName}
              </div>
              <div>
                <strong>Tissue:</strong> {point.metadata?.organ}
              </div>
              <div>
                <strong>Strand:</strong> {point.metadata?.strand}
              </div>
              {scale === "linear" ? (
                <div>
                  <strong>RPM:</strong> {point.metadata?.value.toFixed(2)}
                </div>
              ) : (
                <div>
                  <strong>
                    Log<sub>10</sub>(RPM + 1):
                  </strong>{" "}
                  {point.value.toFixed(2)}
                </div>
              )}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default TranscriptExpressionViolinPlot;
