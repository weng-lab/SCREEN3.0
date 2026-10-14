import { GWASEnrichment } from "common/hooks/data/gwas";
import { BarPlot, BarData, DownloadPlotHandle } from "@weng-lab/visualization";
import { Box } from "@mui/material";
import PlotTooltip from "common/components/PlotTooltip";
import { capitalizeFirstLetter, truncateString } from "common/utils";
import { tissueColors } from "common/colors";
import { useMemo } from "react";

export type BiosampleEnrichmentBarPlotProps = {
  selected: GWASEnrichment[];
  sortedFilteredData: GWASEnrichment[];
  toggleSelection: (item: GWASEnrichment) => void;
  getRowId: (item: GWASEnrichment) => string;
  ref?: React.RefObject<DownloadPlotHandle>;
  study: string;
};

const TooltipContents = ({ metadata }: BarData<GWASEnrichment>) => (
  <PlotTooltip
    title={capitalizeFirstLetter(metadata.displayname?.replaceAll("_", " ") ?? "")}
    rows={[
      { label: "Accession", value: metadata.accession },
      { label: "Organ/Tissue", value: capitalizeFirstLetter(metadata.ontology) },
      { label: "Log₂(Fold Enrichment)", value: metadata.fc.toFixed(3) },
      { label: "FDR", value: metadata.fdr.toFixed(3) },
      { label: "P", value: metadata.pvalue.toFixed(3) },
    ]}
  />
);

const BiosampleEnrichmentBarPlot = ({
  selected,
  sortedFilteredData,
  toggleSelection,
  getRowId,
  ref,
  study,
}: BiosampleEnrichmentBarPlotProps) => {
  const plotData: BarData<GWASEnrichment>[] = useMemo(() => {
    if (!sortedFilteredData) return [];
    return sortedFilteredData.map((x) => {
      const anySelected = selected.length > 0;
      const isSelected = selected.some((y) => getRowId(y) === getRowId(x));
      const name = capitalizeFirstLetter(truncateString(x.displayname?.replaceAll("_", " ") ?? "", 20));

      return {
        category: capitalizeFirstLetter(x.ontology),
        label: `${x.fc.toFixed(2)}, ${name}, (${x.accession})`,
        value: x.fc,
        color:
          (anySelected && isSelected) || !anySelected ? (tissueColors[x.ontology] ?? tissueColors.missing) : "#CCCCCC",
        id: getRowId(x),
        metadata: x,
        lollipopValue: x.fdr,
      };
    });
  }, [sortedFilteredData, selected, getRowId]);

  const handleBarClick = (bar: BarData<GWASEnrichment>) => {
    toggleSelection(bar.metadata);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
        <BarPlot
          barSize={3}
          barSpacing={20}
          legendTitle={"FDR"}
          onBarClicked={handleBarClick}
          data={plotData}
          topAxisLabel={`Log2(Fold Enrichment)`}
          TooltipContents={TooltipContents}
          ref={ref}
          downloadFileName={`${study}_lollipop_plot`}
          animation="slideRight"
          animationBuffer={0.01}
        />
      </Box>
    </Box>
  );
};

export default BiosampleEnrichmentBarPlot;
