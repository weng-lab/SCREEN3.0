import { Box } from "@mui/system";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { capitalizeFirstLetter } from "common/utils";
import { formatAssay } from "common/assays";
import { tissueColors } from "common/colors";
import { useMemo, useState } from "react";
import { sortDistributions, handleViolinToggle, type ViolinSortBy } from "common/utils";
import PlotTooltip from "common/components/PlotTooltip";
import AssayPlotControls from "./AssayPlotControls";
import { biosampleTooltip, type AssayViolinPlotProps, type BiosampleRow } from "./types";

const AssayViolinPlot = ({
  rows,
  assay,
  entityID,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  viewBy,
  setViewBy,
  cutoffLowSignal,
  setCutoffLowSignal,
  show95Line,
  setShow95Line,
  ref,
}: AssayViolinPlotProps) => {
  const [sortBy, setSortBy] = useState<ViolinSortBy>("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const violinData: Distribution<BiosampleRow>[] = useMemo(() => {
    if (!rows) return [];

    const tissueGroups = rows.reduce(
      (acc, item) => {
        const key = item.ontology;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, BiosampleRow[]>
    );

    const distributions = Object.entries(tissueGroups).map(([tissue, group]) => {
      const label = capitalizeFirstLetter(tissue);

      const noneSelected = selected.length === 0;
      const allInViolinSelected = group.every((d) => selected.some((s) => getRowId(s) === getRowId(d)));

      const violinColor =
        noneSelected || allInViolinSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";

      const data: ViolinPoint<BiosampleRow>[] = group.map((sample) => {
        const isSelected = noneSelected || selected.some((s) => getRowId(s) === getRowId(sample));
        const pointColor = isSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return {
          value: sample[assay] ?? 0,
          radius: pointRadius,
          tissue,
          metadata: sample,
          color: pointColor,
        };
      });

      return { label, data, violinColor };
    });

    sortDistributions(distributions, sortBy);

    return distributions;
  }, [assay, selected, rows, sortBy, getRowId]);

  const onViolinClicked = (distribution: Distribution<BiosampleRow>) => {
    handleViolinToggle(distribution, selected, setSelected, getRowId);
  };

  const onPointClicked = (point: ViolinPoint<BiosampleRow>) => {
    toggleSelection(point.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <AssayPlotControls
        viewBy={viewBy}
        setViewBy={setViewBy}
        violin
        sortBy={sortBy}
        setSortBy={setSortBy}
        showPoints={showPoints}
        setShowPoints={setShowPoints}
        cutoffLowSignal={cutoffLowSignal}
        setCutoffLowSignal={setCutoffLowSignal}
        show95Line={show95Line}
        setShow95Line={setShow95Line}
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <ViolinPlot
          distributions={violinData}
          axisLabel={`${entityID} ${formatAssay(assay)} z-scores`}
          loading={!violinData.length}
          onViolinClicked={onViolinClicked}
          onPointClicked={onPointClicked}
          labelOrientation="leftDiagonal"
          cutoffValue={cutoffLowSignal ? -0.5 : undefined}
          show95thPercentileLine={show95Line}
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
          downloadFileName={`${assay}_violin_plot`}
          pointTooltipBody={(point) => (
            <PlotTooltip {...biosampleTooltip(point.metadata!, assay)} note={point.outlier ? "Outlier" : undefined} />
          )}
        />
      </Box>
    </Box>
  );
};

export default AssayViolinPlot;
