import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPlotProps, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/colors";
import GenePlotControls from "./GenePlotControls";

export type GeneExpressionViolinPlotProps = GeneExpressionProps &
  SharedGeneExpressionPlotProps &
  Partial<ViolinPlotProps<PointMetadata>> & {
    scale: "linearTPM" | "logTPM";
  };

const GeneExpressionBarPlot = ({
  scale,
  setScale,
  geneData,
  selected,
  sortedFilteredData,
  setSelected,
  assembly,
  RNAtype,
  setRNAType,
  viewBy,
  setViewBy,
  replicates,
  setReplicates,
  ref,
  rows,
  ...rest
}: GeneExpressionViolinPlotProps) => {
  const [sortBy, setSortBy] = useState<"median" | "max" | "tissue">("max");
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const violinData: Distribution<PointMetadata>[] = useMemo(() => {
    if (!rows) return [];

    const grouped = rows.reduce(
      (acc, item) => {
        const key = item.tissue;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, PointMetadata[]>
    );

    const distributions = Object.entries(grouped).map(([tissue, group]) => {
      const values = group.map((d) => d.gene_quantification_files[0].quantifications[0]?.tpm);
      const label = tissue;
      const violinColor =
        selected.length === 0 ||
        group.every((d) =>
          selected.some((s) => s.gene_quantification_files[0].accession === d.gene_quantification_files[0].accession)
        )
          ? (tissueColors[tissue] ?? tissueColors.missing)
          : "#CCCCCC";

      const data: ViolinPoint<PointMetadata>[] = values.map((value, i) => {
        const metadata = group[i];
        const isSelected =
          selected.length === 0 ||
          selected.some(
            (s) => s.gene_quantification_files[0].accession === metadata.gene_quantification_files[0].accession
          );
        const pointColor = isSelected ? (tissueColors[tissue] ?? tissueColors.missing) : "#CCCCCC";
        const pointRadius = isSelected ? 4 : 2;

        return values.length < 3
          ? { value, radius: pointRadius, tissue, metadata, color: pointColor }
          : {
              value,
              radius: selected.length === 0 ? 2 : pointRadius,
              tissue,
              metadata,
              color: pointColor,
            };
      });

      return { label, data, violinColor };
    });

    //apply sorting
    distributions.sort((a, b) => {
      if (sortBy === "tissue") {
        return a.label.localeCompare(b.label); // alphabetical
      }
      if (sortBy === "median") {
        const median = (arr: number[]) => {
          const sorted = [...arr].sort((x, y) => x - y);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        };
        return median(b.data.map((d) => d.value)) - median(a.data.map((d) => d.value));
      }
      if (sortBy === "max") {
        return Math.max(...b.data.map((d) => d.value)) - Math.max(...a.data.map((d) => d.value));
      }
      return 0;
    });

    return distributions;
  }, [selected, rows, sortBy]);

  const onViolinClicked = (violin: Distribution<PointMetadata>) => {
    const rowsForDistribution = violin.data.map((point) => point.metadata);

    const allInDistributionSelected = rowsForDistribution.every((row) =>
      selected.some((x) => x.accession === row.accession)
    );

    if (allInDistributionSelected) {
      setSelected(selected.filter((row) => !rowsForDistribution.some((x) => x.accession === row.accession)));
    } else {
      const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => x.accession === row.accession));
      setSelected([...selected, ...toSelect]);
    }
  };

  const onPointClicked = (point: ViolinPoint<PointMetadata>) => {
    const id = point.metadata.accession;
    if (selected.some((x) => x.accession === id)) {
      setSelected(selected.filter((x) => x.accession !== id));
    } else {
      setSelected([...selected, point.metadata]);
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      padding={1}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
    >
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
        violin={true}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showPoints={showPoints}
        setShowPoints={setShowPoints}
      />
      <Box
        width={"100%"}
        height={"calc(100% - 63px)"} // bad fix for adjusting height to account for controls
      >
        <ViolinPlot
          {...rest}
          onPointClicked={onPointClicked}
          onViolinClicked={onViolinClicked}
          distributions={violinData}
          axisLabel={
            scale === "linearTPM"
              ? `${geneData?.data.name} Expression - TPM`
              : `${geneData?.data.name} Expression - Log\u2081\u2080(TPM + 1)`
          }
          loading={geneData.loading}
          labelOrientation="leftDiagonal"
          violinProps={{
            bandwidth: "scott",
            showAllPoints: showPoints,
            jitter: 10,
          }}
          crossProps={{
            outliers: showPoints ? "all" : "none",
          }}
          ref={ref}
          downloadFileName={`${geneData.data.name}_expression_violin_plot`}
          pointTooltipBody={(point) => {
            const rawTPM = point.metadata?.gene_quantification_files[0].quantifications[0]?.tpm ?? 0;
            const displayTPM = scale === "linearTPM" ? rawTPM : Math.log10(rawTPM + 1);

            return (
              <Box maxWidth={300}>
                {point.outlier && (
                  <div>
                    <strong>Outlier</strong>
                  </div>
                )}
                <div>
                  <strong>Accession:</strong> {point.metadata?.accession}
                </div>
                <div>
                  <strong>Biosample:</strong> {point.metadata?.biosample}
                </div>
                <div>
                  <strong>Tissue:</strong> {point.metadata?.tissue}
                </div>
                <div>
                  <strong>{scale === "linearTPM" ? "TPM" : "Log₁₀(TPM + 1)"}:</strong> {displayTPM.toFixed(2)}
                </div>
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default GeneExpressionBarPlot;
