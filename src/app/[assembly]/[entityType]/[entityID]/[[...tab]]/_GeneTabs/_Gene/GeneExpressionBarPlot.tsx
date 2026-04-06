import { GeneExpressionBarPlotProps, getScaleLabel, getScaledTPM, PointMetadata } from "./types";
import { useCallback, useMemo } from "react";
import { capitalizeFirstLetter } from "common/utility";
import { Box, Typography } from "@mui/material";
import { tissueColors } from "common/colors";
import { BarPlot, BarData } from "@weng-lab/visualization";
import GenePlotControls from "./GenePlotControls";

const GeneExpressionBarPlot = ({
  scale,
  selected,
  toggleSelection,
  sortedFilteredData,
  RNAtype,
  setRNAType,
  viewBy,
  setViewBy,
  setScale,
  replicates,
  setReplicates,
  ref,
  geneName,
  assembly,
  getRowId,
}: GeneExpressionBarPlotProps) => {
  const makeLabel = (tpm: number, biosample: string, accession: string, biorep?: number): string => {
    const maxLength = 20;
    let name = biosample.replaceAll("_", " ");
    if (name.length > maxLength) {
      name = name.slice(0, maxLength) + "...";
    }
    name = capitalizeFirstLetter(name);
    return `${tpm.toFixed(2)}, ${name} (${accession}${biorep ? ", rep. " + biorep : ""})`;
  };

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      return {
        category: capitalizeFirstLetter(x.tissue),
        label: makeLabel(getScaledTPM(x, scale), x.biosample, x.exp_accession, x.biorep),
        value: getScaledTPM(x, scale),
        color:
          (anySelected && isSelected) || !anySelected ? (tissueColors[x.tissue] ?? tissueColors.missing) : "#CCCCCC",
        id: i.toString(),
        metadata: x,
      };
    });
  }, [sortedFilteredData, selected, getRowId, scale]);

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    toggleSelection(bar.metadata);
  };

  const PlotTooltip = useCallback(
    (bar: BarData<PointMetadata>) => {
      return (
        <Box maxWidth={350}>
          <Typography variant="body2">
            <b>Sample:</b> {capitalizeFirstLetter(bar.metadata.biosample)}
          </Typography>
          <Typography variant="body2">
            <b>Tissue:</b> {capitalizeFirstLetter(bar.metadata.tissue)}
          </Typography>
          <Typography variant="body2">
            <b>Biosample Type:</b> {capitalizeFirstLetter(bar.metadata.biosample_type)}
          </Typography>
          {scale === "linearTPM" ? (
            <Typography variant="body2">
              <b>TPM:</b> {bar.value.toFixed(1)}
            </Typography>
          ) : (
            <Typography variant="body2">
              <b>
                Log<sub>10</sub>(TPM + 1):
              </b>{" "}
              {bar.value.toFixed(1)}
            </Typography>
          )}
        </Box>
      );
    },
    [scale]
  );

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
      />
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          onBarClicked={handleBarClick}
          data={plotData}
          topAxisLabel={getScaleLabel(geneName, scale)}
          TooltipContents={PlotTooltip}
          ref={ref}
          downloadFileName={`${geneName}_expression_bar_plot`}
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default GeneExpressionBarPlot;
