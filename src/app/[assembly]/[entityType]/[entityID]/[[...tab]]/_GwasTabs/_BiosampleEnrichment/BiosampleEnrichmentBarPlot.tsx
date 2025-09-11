import { GWASEnrichment, UseGWASEnrichmentReturn } from "common/hooks/useGWASEnrichmentData";
//import VerticalBarPlot, { BarData, BarPlotProps } from "common/components/VerticalBarPlot";
import { BarPlot, BarData, BarPlotProps } from "@weng-lab/visualization";
import { Box } from "@mui/material";
import { capitalizeFirstLetter } from "common/utility";
import { tissueColors } from "common/lib/colors";
import { useMemo } from "react";
export type BiosampleEnrichmentBarPlotProps = {
  data: UseGWASEnrichmentReturn;
  selected: GWASEnrichment[];
  sortedFilteredData: GWASEnrichment[];
  onBarClicked: (bar: BarData<GWASEnrichment>) => void;
};

const BiosampleEnrichmentBarPlot = ({
  data,
  selected,
  sortedFilteredData,
  ...rest
}: BiosampleEnrichmentBarPlotProps) => {
  const makeLabel = (fc: number, biosample: string, accession: string): string => {
    const maxLength = 50;
    let name = biosample?.replaceAll("_", " ");
    if (name?.length > maxLength) {
      name = name?.slice(0, maxLength) + "...";
    }
    name = capitalizeFirstLetter(name);
    return `${fc.toFixed(2)}, ${accession},${name}`;
  };
  // Add functionality for replicates and log
  const plotData: BarData<GWASEnrichment>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x, i) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => y.accession === x.accession);

      return {
        category: x.ontology,
        label: makeLabel(x.fc, x.displayname, x.accession),
        value: x.fc, //indexing into 0th position, only one gene so quantifications should always be length 1
        color:
          (anySelected && isSelected) || !anySelected ? tissueColors[x.ontology] ?? tissueColors.missing : "#CCCCCC",
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
            <>
              <div style={{ padding: 2 }}>
                <strong>{bar.label}</strong>
                <br />
                {bar.metadata && <div>FDR: {bar.metadata.fdr.toFixed(3)}</div>}
              </div>
            </>
          );
        }}
      />
    </Box>
  );
};
export default BiosampleEnrichmentBarPlot;
