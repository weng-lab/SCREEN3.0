import { Box } from "@mui/system";
import { BarData, BarPlot, Distribution, ViolinPlot, ViolinPoint } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { BiosampleRow, formatAssay } from "./BiosampleActivity";
import { useMemo } from "react";
import { metadata } from "app/layout";

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
    if (!rows) return [];

    const tissueGroups = rows.reduce((acc, item) => {
      const key = item.ontology;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, BiosampleRow[]>);

    return Object.entries(tissueGroups).map(([tissue, group]) => {
      const label = capitalizeFirstLetter(tissue);

      const isHighlighted = (x: BiosampleRow) => selected.some((y) => y.name === x.name);

      const noneSelected = selected.length === 0;
      const allInViolinSelected = group.every((d) => selected.some((s) => s.name === d.name));

      const violinColor =
        noneSelected || allInViolinSelected ? tissueColors[tissue] ?? tissueColors.missing : "#CCCCCC";

      const data: ViolinPoint<BiosampleRow>[] = group.map((sample, i) => {
        const pointColor = noneSelected || isHighlighted(sample) ? tissueColors[tissue] ?? tissueColors.missing : "#CCCCCC";
        const pointRadius = isHighlighted(sample) ? 4 : 2;

        return { value: sample[assay], radius: pointRadius, tissue: tissue, metadata: sample, color: pointColor }
      }).sort((a, b) => (isHighlighted(b.metadata) ? -1 : 0)) ;

      return { label, data, violinColor };
    }).sort((a, b) => a.label.localeCompare(b.label)) ;
  }, [assay, selected, rows]);

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
