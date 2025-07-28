import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import VerticalBarPlot, { BarData, BarPlotProps } from "common/components/VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"
import { Box } from "@mui/material"

export type GeneExpressionBarPlotProps = 
  GeneExpressionProps & 
  SharedGeneExpressionPlotProps &
  Partial<BarPlotProps<PointMetadata>>

const GeneExpressionBarPlot = ({geneData, selected, sortedFilteredData, ...rest}: GeneExpressionBarPlotProps) => {

  const plotData: BarData<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return []
    return (
      sortedFilteredData.map((x, i) => {
        const anySelected = selected.length > 0
        const isSelected = selected.some(y => y.name === x.name)
        return (
          {
            category: getCellCategoryDisplayname(x.lineage),
            label: `${x.value.toFixed(1)}, ${x.biosample.slice(0, 23) + (x.biosample.length > 23 ? "..." : "")}`,
            value: x.value,
            id: i.toString(),
            color: (anySelected && isSelected || !anySelected) ? getCellCategoryColor(x.lineage) : '#CCCCCC',
            metadata: x
          }
        )
      })
    )
  }, [sortedFilteredData, selected])

  return(
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative"}}>
      <VerticalBarPlot
        {...rest}
        data={plotData}
        topAxisLabel={`${geneData?.data.name} Expression - TPM`}
      />
    </Box>
  )
}

export default GeneExpressionBarPlot