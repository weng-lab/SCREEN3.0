import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import { useMemo } from "react"
import { capitalizeFirstLetter } from "common/utility"
import { Box } from "@mui/material"
import { tissueColors } from "common/lib/colors"
import { BarPlot, BarData, BarPlotProps } from "@weng-lab/visualization";
import { Assembly } from "types/globalTypes"

export type GeneExpressionBarPlotProps =
  GeneExpressionProps &
  SharedGeneExpressionPlotProps &
  Partial<BarPlotProps<PointMetadata>>

const GeneExpressionBarPlot = ({ geneData, selected, assembly, sortedFilteredData, ...rest }: GeneExpressionBarPlotProps) => {

  const makeLabel = (tpm: number, biosample: string, accession: string, biorep?: number): string => {
    const maxLength = 20;
    let name = biosample.replaceAll("_", " ");
    if (name.length > maxLength) {
      name = name.slice(0, maxLength) + '...';
    }
    name = capitalizeFirstLetter(name);
    return `${tpm.toFixed(2)}, ${name} (${accession}${biorep ? ', rep. ' + biorep : ''})`;
  }

  // Add functionality for replicates and log
  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return []
    return (
      sortedFilteredData.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.some(y => y.gene_quantification_files[0].accession === x.gene_quantification_files[0].accession)
        return (
          {
            category: x.tissue,
            label: makeLabel(x.gene_quantification_files[0].quantifications[0].tpm, x.biosample, x.accession),
            value: x.gene_quantification_files[0].quantifications[0].tpm, //indexing into 0th position, only one gene so quantifications should always be length 1
            color: (anySelected && isSelected || !anySelected) ? tissueColors[x.tissue] ?? tissueColors.missing : '#CCCCCC',
            id: i.toString(),
            metadata: x
          }
        )
      })
    )
  }, [sortedFilteredData, selected])

  return (
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative" }}>
      <BarPlot
        {...rest}
        data={plotData}
        topAxisLabel={`${geneData?.data.name} Expression - TPM`}
      />
    </Box>
  )
}

export default GeneExpressionBarPlot