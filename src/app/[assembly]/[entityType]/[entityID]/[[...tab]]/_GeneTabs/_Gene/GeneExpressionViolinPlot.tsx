import { GeneExpressionViolinPlotProps, getScaleLabel, getScaledTPM, PointMetadata } from "./types";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import { sortDistributions, handleViolinToggle, type ViolinSortBy } from "common/violinUtils";
import GenePlotControls from "./GenePlotControls";

const GeneExpressionViolinPlot = ({
  scale,
  setScale,
  selected,
  setSelected,
  toggleSelection,
  RNAtype,
  setRNAType,
  viewBy,
  setViewBy,
  replicates,
  setReplicates,
  ref,
  rows,
  geneName,
  assembly,
  loading,
  getRowId,
}: GeneExpressionViolinPlotProps) => {
  const [sortBy, setSortBy] = useState<ViolinSortBy>("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const violinData: Distribution<PointMetadata>[] = useMemo(() => {
    if (!rows) return [];

    const grouped = rows.reduce(
      (acc, item) => {
        const key = item.tissue;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, PointMetadata[]>
    );

    const distributions = Object.entries(grouped).map(([tissue, group]) => {
      const values = group.map((d) => getScaledTPM(d, scale));
      const label = tissue;
      const violinColor =
        selected.length === 0 ||
        group.every((d) => selected.some((s) => getRowId(s) === getRowId(d)))
          ? (tissueColors[tissue] ?? tissueColors.missing)
          : "#CCCCCC";

      const data: ViolinPoint<PointMetadata>[] = values.map((value, i) => {
        const metadata = group[i];
        const isSelected =
          selected.length === 0 ||
          selected.some((s) => getRowId(s) === getRowId(metadata));
        const pointColor = isSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return values.length < 3
          ? { value, radius: pointRadius, tissue, metadata, color: pointColor }
          : {
              value,
              radius: selected.length === 0 ? 2 : pointRadius,
              tissue,
              metadata,
              color: pointColor,
            };
      });

      return { label, data, violinColor };
    });

    sortDistributions(distributions, sortBy);

    return distributions;
  }, [rows, selected, getRowId, sortBy, scale]);

  const onViolinClicked = (violin: Distribution<PointMetadata>) => {
    handleViolinToggle(violin, selected, setSelected, getRowId);
  };

  const onPointClicked = (point: ViolinPoint<PointMetadata>) => {
    toggleSelection(point.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <GenePlotControls
        assembly={assembly}
        RNAtype={RNAtype}
        scale={scale}
        viewBy={viewBy}
        replicates={replicates}
        setRNAType={setRNAType}
        setViewBy={setViewBy}
        setScale={setScale}
        setReplicates={setReplicates}
        violin={true}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showPoints={showPoints}
        setShowPoints={setShowPoints}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <ViolinPlot
          onPointClicked={onPointClicked}
          onViolinClicked={onViolinClicked}
          distributions={violinData}
          axisLabel={getScaleLabel(geneName, scale)}
          loading={loading}
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
          downloadFileName={`${geneName}_expression_violin_plot`}
          pointTooltipBody={(point) => (
            <Box maxWidth={300}>
              {point.outlier && (
                <div>
                  <strong>Outlier</strong>
                </div>
              )}
              <div>
                <strong>Accession:</strong> {point.metadata?.exp_accession}
                {point.metadata?.biorep != null && ` (rep. ${point.metadata.biorep})`}
              </div>
              <div>
                <strong>Biosample:</strong> {point.metadata?.biosample}
              </div>
              <div>
                <strong>Tissue:</strong> {point.metadata?.tissue}
              </div>
              <div>
                <strong>{scale === "linearTPM" ? "TPM" : "Log\u2081\u2080(TPM + 1)"}:</strong> {point.value.toFixed(1)}
              </div>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default GeneExpressionViolinPlot;
