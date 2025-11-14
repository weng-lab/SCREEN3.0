import { Box } from "@mui/system";
import { Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { capitalizeFirstLetter, formatAssay } from "common/utility";
import { tissueColors } from "common/colors";
import { useMemo, useState } from "react";
import AssayPlotControls from "./AssayPlotControls";
import type { SharedAssayViewPlotProps, BiosampleRow } from "./types";

const AssayViolinPlot = ({
  entity,
  rows,
  assay,
  selected,
  setSelected,
  viewBy,
  setViewBy,
  cutoffLowSignal,
  setCutoffLowSignal,
  ref,
}: SharedAssayViewPlotProps) => {
  const [sortBy, setSortBy] = useState<"median" | "max" | "tissue">("max");
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

      const isHighlighted = (x: BiosampleRow) => selected.some((y) => y.name === x.name);

      const noneSelected = selected.length === 0;
      const allInViolinSelected = group.every((d) => selected.some((s) => s.name === d.name));

      const violinColor =
        noneSelected || allInViolinSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";

      const data: ViolinPoint<BiosampleRow>[] = group
        .map((sample) => {
          const pointColor =
            noneSelected || isHighlighted(sample) ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";
          const pointRadius = isHighlighted(sample) ? 4 : 2;

          return {
            value: sample[assay] ?? 0,
            radius: pointRadius,
            tissue,
            metadata: sample,
            color: pointColor,
          };
        })
        .sort((a, b) => (isHighlighted(b.metadata) ? -1 : 0));

      return { label, data, violinColor };
    });

    //apply sorting
    distributions.sort((a, b) => {
      if (sortBy === "tissue") {
        return a.label.localeCompare(b.label);
      }
      if (sortBy === "median") {
        const median = (arr: number[]) => {
          const sorted = [...arr].sort((x, y) => x - y);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };
        return median(b.data.map((d) => d.value)) - median(a.data.map((d) => d.value));
      }
      if (sortBy === "max") {
        return Math.max(...b.data.map((d) => d.value)) - Math.max(...a.data.map((d) => d.value));
      }
      return 0;
    });

    return distributions;
  }, [assay, selected, rows, sortBy]);

  const onViolinClicked = (distribution: Distribution<BiosampleRow>) => {
    const rowsForDistribution = distribution.data.map((point) => point.metadata);

    const allInDistributionSelected = rowsForDistribution.every((row) => selected.some((x) => x.name === row.name));

    if (allInDistributionSelected) {
      setSelected((prev) => prev.filter((row) => !rowsForDistribution.some((x) => x.name === row.name)));
    } else {
      const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => x.name === row.name));
      setSelected((prev) => [...prev, ...toSelect]);
    }
  };

  const onPointClicked = (point: ViolinPoint<BiosampleRow>) => {
    if (selected.includes(point.metadata)) {
      setSelected(selected.filter((x) => x.name !== point.metadata.name));
    } else setSelected([...selected, point.metadata]);
  };

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
        violin
        sortBy={sortBy}
        setSortBy={setSortBy}
        showPoints={showPoints}
        setShowPoints={setShowPoints}
        cutoffLowSignal={cutoffLowSignal}
        setCutoffLowSignal={setCutoffLowSignal}
      />
      <Box
        width={"100%"}
        height={"calc(100% - 63px)"} // bad fix for adjusting height to account for controls
      >
        <ViolinPlot
          distributions={violinData}
          axisLabel={`${entity.entityID} ${formatAssay(assay)} z-scores`}
          loading={!violinData.length}
          onViolinClicked={onViolinClicked}
          onPointClicked={onPointClicked}
          labelOrientation="leftDiagonal"
          cutoffValue={cutoffLowSignal ? -0.5 : undefined}
          violinProps={{
            bandwidth: "scott",
            showAllPoints: showPoints,
            jitter: 10,
          }}
          crossProps={{
            outliers: showPoints ? "all" : "none",
          }}
          ref={ref}
          downloadFileName={`${assay}_violin_plot`}
          pointTooltipBody={(point) => {
            return (
              <Box maxWidth={300}>
                {point.outlier && (
                  <div>
                    <strong>Outlier</strong>
                  </div>
                )}
                <div>
                  <strong>Sample:</strong> {point.metadata?.displayname}
                </div>
                <div>
                  <strong>Organ/Tissue:</strong> {point.metadata?.ontology}
                </div>
                <div>
                  <strong>Sample Type:</strong> {point.metadata?.sampleType}
                </div>
                <div>
                  <strong>{formatAssay(assay)} z-score:</strong> {point.metadata[assay]}
                </div>
                <div>
                  <strong>Class in this sample:</strong> {point.metadata?.class}
                </div>
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default AssayViolinPlot;
