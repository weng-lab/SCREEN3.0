import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import { useCallback, useMemo } from "react"
import { capitalizeFirstLetter } from "common/utility"
import { Box, Typography } from "@mui/material"
import { tissueColors } from "common/lib/colors"
import { BarPlot, BarData, BarPlotProps } from "@weng-lab/visualization";
import GenePlotControls from "./GenePlotControls"

export type GeneExpressionBarPlotProps =
  GeneExpressionProps &
  SharedGeneExpressionPlotProps &
  Partial<BarPlotProps<PointMetadata>> & {
    scale: "linearTPM" | "logTPM";
  }

const GeneExpressionBarPlot = ({
  scale,
  geneData,
  selected,
  setSelected,
  assembly,
  sortedFilteredData,
  RNAtype,
  setRNAType,
  viewBy,
  setViewBy,
  setScale,
  replicates,
  setReplicates,
  ref,
  isV40,
  ...rest
}: GeneExpressionBarPlotProps) => {

  const makeLabel = (tpm: number, biosample: string, accession: string, biorep?: number): string => {
    const maxLength = 20;
    let name = biosample.replaceAll("_", " ");
    if (name.length > maxLength) {
      name = name.slice(0, maxLength) + '...';
    }
    name = capitalizeFirstLetter(name);
    return `${tpm.toFixed(2)}, ${name} (${accession}${biorep ? ', rep. ' + biorep : ''})`;
  }

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return []
    return (
      sortedFilteredData.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.some(y => y.gene_quantification_files[0].accession === x.gene_quantification_files[0].accession)
        return (
          {
            category: x.tissue,
            label: makeLabel(x.gene_quantification_files[0].quantifications[0]?.tpm, x.biosample, x.accession),
            value: x.gene_quantification_files[0].quantifications[0]?.tpm, //indexing into 0th position, only one gene so quantifications should always be length 1
            color: (anySelected && isSelected || !anySelected) ? tissueColors[x.tissue] ?? tissueColors.missing : '#CCCCCC',
            id: i.toString(),
            metadata: x
          }
        )
      })
    )
  }, [sortedFilteredData, selected])

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x !== bar.metadata));
    } else setSelected([...selected, bar.metadata]);
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
            <b>Biosample Type:</b>{" "}
            {capitalizeFirstLetter(bar.metadata.biosample_type)}
          </Typography>
          {scale === "linearTPM" ? (
            <Typography variant="body2">
              <b>TPM:</b> {bar.value.toFixed(2)}
            </Typography>
          ) : (
            <Typography variant="body2">
              <b>
                Log<sub>10</sub>(TPM + 1):
              </b>{" "}
              {bar.value.toFixed(2)}
            </Typography>
          )}
        </Box>
      );
    },
    [scale]
  );

  return (
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative" }}>
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
        disabled={isV40}
      />
      {isV40 ? (
        <Typography>No Gene expression data availible on GENCODE V40 genes</Typography>
      ) : (
        <BarPlot
          {...rest}
          onBarClicked={handleBarClick}
          data={plotData}
          topAxisLabel={
            scale === "linearTPM"
              ? `${geneData?.data.name} Expression - TPM`
              : `${geneData?.data.name} Expression - Log\u2081\u2080(TPM + 1)`
          }
          TooltipContents={PlotTooltip}
          ref={ref}
          downloadFileName={`${geneData.data.name}_expression_bar_plot`}
        />
      )}
    </Box>
  )
}

export default GeneExpressionBarPlot