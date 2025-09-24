import { Box } from "@mui/system";
import { BarData, BarPlot } from "@weng-lab/visualization";
import { SharedAssayViewPlotProps } from "./AssayView";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { BiosampleRow, formatAssay } from "./BiosampleActivity";
import { useMemo } from "react";

const AssayBarPlot = ({
  entity,
  rows,
  columns,
  assay,
  selected,
  setSelected,
  sortedFilteredData,
  setSortedFilteredData,
}: SharedAssayViewPlotProps) => {
  const plotData: BarData<BiosampleRow>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((row) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((x) => x.name === row.name);
      return {
        value: row[assay],
        id: row.name,
        category: capitalizeFirstLetter(row.ontology),
        label: truncateString(capitalizeFirstLetter(row.displayname), 25),
        color:
          (anySelected && isSelected) || !anySelected ? tissueColors[row.ontology] ?? tissueColors.missing : "#CCCCCC",
        metadata: row,
      };
    });
  }, [assay, selected, sortedFilteredData]);

  const handleBarClick = (bar: BarData<BiosampleRow>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x.name !== bar.metadata.name));
    } else setSelected([...selected, bar.metadata]);
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <BarPlot
        data={plotData}
        topAxisLabel={`${entity.entityID} ${formatAssay(assay)} z-scores`}
        cutoffNegativeValues
        onBarClicked={handleBarClick}
      />
    </Box>
  );
};

export default AssayBarPlot;
