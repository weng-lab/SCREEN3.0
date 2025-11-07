import { GWASEnrichment, UseGWASEnrichmentReturn } from "common/hooks/useGWASEnrichmentData";
//import VerticalBarPlot, { BarData, BarPlotProps } from "common/components/VerticalBarPlot";
import { BarPlot, BarData, DownloadPlotHandle } from "@weng-lab/visualization";
import { Box, Typography } from "@mui/material";
import { capitalizeFirstLetter, truncateString } from "common/utility";
import { tissueColors } from "common/colors";
import { useMemo } from "react";
export type BiosampleEnrichmentBarPlotProps = {
  data: UseGWASEnrichmentReturn;
  selected: GWASEnrichment[];
  sortedFilteredData: GWASEnrichment[];
  onBarClicked: (bar: BarData<GWASEnrichment>) => void;
  ref: React.RefObject<DownloadPlotHandle>;
  study: string;
};

const BiosampleEnrichmentBarPlot = ({
  data,
  selected,
  sortedFilteredData,
  ref,
  study,
  ...rest
}: BiosampleEnrichmentBarPlotProps) => {
  const makeLabel = (fc: number, biosample: string, accession: string): string => {
    let name = biosample?.replaceAll("_", " ");
    name = capitalizeFirstLetter(truncateString(name, 40));
    return `${fc.toFixed(2)}, ${accession}, ${name}`;
  };
  // Add functionality for replicates and log
  const plotData: BarData<GWASEnrichment>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => y.accession === x.accession);

      return {
        category: capitalizeFirstLetter(x.ontology),
        label: makeLabel(x.fc, x.displayname, x.accession),
        value: x.fc,
        color:
          (anySelected && isSelected) || !anySelected ? (tissueColors[x.ontology] ?? tissueColors.missing) : "#CCCCCC",
        id: i.toString(),
        metadata: x,
        lollipopValue: x.fdr,
      };
    });
  }, [sortedFilteredData, selected]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <BarPlot
        barSize={3}
        barSpacing={20}
        legendTitle={"FDR"}
        {...rest}
        data={plotData}
        topAxisLabel={`Log2(Fold Enrichment)`}
        TooltipContents={(bar) => {
          return (
            <div style={{ padding: 2, maxWidth: 350 }}>
              <Typography>{capitalizeFirstLetter(bar.metadata.displayname?.replaceAll("_", " "))}</Typography>
              <Typography variant="body2">Log2(Fold Enrichment): {bar.metadata.fc.toFixed(3)}</Typography>
              <Typography variant="body2">FDR: {bar.metadata.fdr.toFixed(3)}</Typography>
              <Typography variant="body2">
                <i>P</i>: {bar.metadata.pvalue.toFixed(3)}
              </Typography>
            </div>
          );
        }}
        ref={ref}
        downloadFileName={`${study}_lollipop_plot`}
      />
    </Box>
  );
};
export default BiosampleEnrichmentBarPlot;
