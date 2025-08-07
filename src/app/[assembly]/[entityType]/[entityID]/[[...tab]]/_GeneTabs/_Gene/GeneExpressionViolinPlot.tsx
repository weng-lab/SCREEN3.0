import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { useMemo } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPlotProps, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/lib/colors"

export type GeneExpressionViolinPlotProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps &
  Partial<ViolinPlotProps<PointMetadata>>;

const GeneExpressionBarPlot = ({ geneData, selected, sortedFilteredData, ...rest }: GeneExpressionViolinPlotProps) => {
  
  const violinData: Distribution<PointMetadata>[] = useMemo(() => {
    if (!sortedFilteredData) return [];

    const grouped = sortedFilteredData.reduce((acc, item) => {
      const key = item.tissue;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, PointMetadata[]>);

    return Object.entries(grouped).map(([tissue, group]) => {
      const values = group.map((d) => d.gene_quantification_files[0].quantifications[0].tpm );
      const label = tissue;
      const violinColor =
        selected.length === 0 || group.every((d) => selected.some((s) => s.gene_quantification_files[0].accession === d.gene_quantification_files[0].accession))
          ? tissueColors[tissue] ?? tissueColors.missing 
          : "#CCCCCC"

      const data: ViolinPoint<PointMetadata>[] = values.map((value, i) => {
        const metaData = group[i];
        const isSelected = selected.length === 0 || selected.some((s) => s.gene_quantification_files[0].accession === metaData.gene_quantification_files[0].accession) ? true : false;
        const pointColor = isSelected ? tissueColors[tissue] ?? tissueColors.missing  : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return values.length < 3
          ? { value, radius: pointRadius, tissue: tissue, metaData, color: pointColor }
          : { value, radius: selected.length === 0 ? 2 : pointRadius, tissue: tissue, metaData, color: pointColor };
      });

      return { label, data, violinColor };
    });
  }, [selected, sortedFilteredData]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
      <ViolinPlot
        {...rest}
        distributions={violinData}
        axisLabel={`${geneData?.data.name} Expression - TPM`}
        loading={geneData.loading}
        labelOrientation="leftDiagonal"
        violinProps={{
          bandwidth: "scott",
          showAllPoints: true,
          jitter: 10,
        }}
        pointTooltipBody={(point) => {
          return (
            <Box>
              {/* {point.outlier && (
                <div>
                  <strong>Outlier</strong>
                </div>
              )} */}
              <div>
                <strong>Accession:</strong> {point.metaData?.accession}
              </div>
              <div>
                <strong>Biosample:</strong> {point.metaData?.biosample}
              </div>
              <div>
                <strong>Tissue:</strong> {point.metaData?.tissue}
              </div>
              <div>
                <strong>TPM:</strong> {point.metaData?.gene_quantification_files[0].quantifications[0].tpm.toFixed(2)}
              </div>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default GeneExpressionBarPlot;
