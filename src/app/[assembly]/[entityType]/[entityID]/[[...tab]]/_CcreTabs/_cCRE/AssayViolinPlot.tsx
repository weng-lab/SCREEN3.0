import { Box } from "@mui/system";
import { BarData, BarPlot, Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { BiosampleRow, formatAssay } from "./BiosampleActivity";
import { useMemo } from "react";

const AssayViolinPlot = ({
  entity,
  rows,
  columns,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  setSortedFilteredData,
}: SharedAssayViewPlotProps) => {

  const violinData: Distribution<BiosampleRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];

    const tissueGroups = sortedFilteredData.reduce((acc, item) => {
      const key = item.ontology;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, BiosampleRow[]>);

    return Object.entries(tissueGroups).map(([tissue, group]) => {
      const values = group.map((d) => d[assay]);
      const label = capitalizeFirstLetter(tissue);
      const violinColor =
        selected.length === 0 ||
        group.every((d) =>
          selected.some((s) => s.name === d.name)
        )
          ? tissueColors[tissue] ?? tissueColors.missing
          : "#CCCCCC";

      const data: ViolinPoint<BiosampleRow>[] = values.map((value, i) => {
        const metadata = group[i];
        const isSelected =
          selected.length === 0 ||
          selected.some(
            (s) => s.name === metadata.name
          )
            ? true
            : false;
        const pointColor = isSelected ? tissueColors[tissue] ?? tissueColors.missing : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return values.length < 3
          ? { value, radius: pointRadius, tissue: tissue, metadata, color: pointColor }
          : { value, radius: selected.length === 0 ? 2 : pointRadius, tissue: tissue, metadata, color: pointColor };
      });

      return { label, data, violinColor };
    });
  }, [assay, selected, sortedFilteredData]);

  const onViolinClicked = (distribution: Distribution<BiosampleRow>) => {
    const rowsForDistribution = distribution.data.map((point) => point.metadata);
    
    const allInDistributionSelected = rowsForDistribution.every(row => selected.some(x => x.name === row.name))

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
      <ViolinPlot
        distributions={violinData}
        axisLabel={`${entity.entityID} ${formatAssay(assay)} z-scores`}
        loading={!violinData.length}
        onViolinClicked={onViolinClicked}
        onPointClicked={onPointClicked}
        labelOrientation="leftDiagonal"
        violinProps={{
          bandwidth: "scott",
          showAllPoints: true,
          jitter: 10,
        }}
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
  );
};

export default AssayViolinPlot;
