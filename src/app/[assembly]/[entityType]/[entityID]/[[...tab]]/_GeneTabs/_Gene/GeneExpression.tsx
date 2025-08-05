import TwoPaneLayout from "../../../../../../../common/components/TwoPaneLayout";
import { useState } from "react";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { BarData } from "../../../../../../../common/components/VerticalBarPlot";
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import { BarChart, ScatterPlot, CandlestickChart } from "@mui/icons-material";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";
import { Distribution, ViolinPoint } from "@weng-lab/visualization";
import { Assembly } from "types/globalTypes";
import { FormControl, FormLabel, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

export type SharedGeneExpressionPlotProps = {
  selected: PointMetadata[];
  geneExpressionData: UseGeneExpressionReturn;
  sortedFilteredData: PointMetadata[];
};

export type GeneExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string }>;
  assembly?: Assembly;
};

const GeneExpression = ({ geneData, assembly }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([]);
  const [scale, setScale] = useState<"linearTPM" | "logTPM">("linearTPM")
  const [replicates, setReplicates] = useState<"mean" | "all">("mean")
  const [viewBy, setViewBy] = useState<"byTissueMaxTPM" | "byExperimentTPM" | "byTissueTPM">("byExperimentTPM")
  const [RNAtype, setRNAType] = useState<"all" | "polyA plus RNA-seq" | "total RNA-seq">("total RNA-seq")

  const handleReplicatesChange = (
    event: React.MouseEvent<HTMLElement>,
    newReplicates: string | null,
  ) => {
    if ((newReplicates !== null) && ((newReplicates === "mean") || (newReplicates === "all"))) {
      setReplicates(newReplicates)
    }
  };

  const handleScaleChange = (
    event: React.MouseEvent<HTMLElement>,
    newScale: string | null,
  ) => {
    if ((newScale !== null) && ((newScale === "linearTPM") || (newScale === "logTPM"))) {
      setScale(newScale)
    }
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null,
  ) => {
    if ((newView !== null) && ((newView === "byTissueMaxTPM") || (newView === "byExperimentTPM") || (newView === "byTissueTPM"))) {
      setViewBy(newView)
    }
  };

  const handleRNATypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newRNA: string | null,
  ) => {
    if ((newRNA !== null) && ((newRNA === "all") || (newRNA === "polyA plus RNA-seq") || (newRNA === "total RNA-seq"))) {
      setRNAType(newRNA)
    }
  };

  const geneExpressionData = useGeneExpression({ id: geneData?.data.id, assembly: assembly });

  const handlePointsSelected = (pointsInfo: PointMetadata[]) => {
    setSelected([...selected, ...pointsInfo]);
  };

  const handleSelectionChange = (selected: PointMetadata[]) => {
    setSelected(selected);
  };

  const handleBarClick = (bar: BarData<PointMetadata>) => {
    if (selected.includes(bar.metadata)) {
      setSelected(selected.filter((x) => x !== bar.metadata));
    } else setSelected([...selected, bar.metadata]);
  };

  const handleViolinClick = (violin: Distribution<PointMetadata>) => {
    const metadataArray = violin.data.map((point) => point.metaData);
    if (selected.length === metadataArray.length && selected[0].tissue === metadataArray[0].tissue) {
      setSelected([]);
    } else setSelected(metadataArray);
  };

  const handleViolinPointClick = (point: ViolinPoint<PointMetadata>) => {
    if (selected.includes(point.metaData)) {
      setSelected(selected.filter((x) => x !== point.metaData));
    } else setSelected([...selected, point.metaData]);
  };

  return (
    <>
      <Stack direction={"row"} gap={2} flexWrap={"wrap"}>
        <FormControl>
          <FormLabel>RNA-seq Type</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={RNAtype}
            exclusive
            onChange={handleRNATypeChange}
            aria-label="RNA-seq Type"
            size="small"
          >
            {/* Human only has total RNA-seq, so disable other options when in human */}
            <ToggleButton sx={{ textTransform: "none" }} value="total RNA-seq">Total</ToggleButton>
            <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
              <div> {/** div needed to show tooltip when button disabled */}
                <ToggleButton disabled={assembly === "GRCh38"} sx={{ textTransform: "none" }} value="polyA plus RNA-seq">PolyA+</ToggleButton>
              </div>
            </Tooltip>
            <Tooltip title={assembly === "GRCh38" && "Only available in mm10"}>
              <div>
                <ToggleButton disabled={assembly === "GRCh38"} sx={{ textTransform: "none" }} value="all">All</ToggleButton>
              </div>
            </Tooltip>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Scale</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={scale}
            exclusive
            onChange={handleScaleChange}
            aria-label="Scale"
            size="small"
          >
            <ToggleButton sx={{ textTransform: "none" }} value="linearTPM">Linear TPM</ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="logTPM">Log<sub>10</sub>(TPM + 1)</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl>
          <FormLabel>View By</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={viewBy}
            exclusive
            onChange={handleViewChange}
            aria-label="View By"
            size="small"
          >
            <ToggleButton sx={{ textTransform: "none" }} value="byExperimentTPM">Experiment</ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="byTissueTPM">Tissue</ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="byTissueMaxTPM">Tissue Max</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Replicates</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={replicates}
            exclusive
            onChange={handleReplicatesChange}
            aria-label="Scale"
            size="small"
          >
            <ToggleButton sx={{ textTransform: "none" }} value="mean">Average</ToggleButton>
            <ToggleButton sx={{ textTransform: "none" }} value="all">Show Replicates</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      </Stack>
    <TwoPaneLayout
      TableComponent={
        <GeneExpressionTable
          geneData={geneData}
          selected={selected}
          onSelectionChange={handleSelectionChange}
          sortedFilteredData={sortedFilteredData}
          setSortedFilteredData={setSortedFilteredData}
          geneExpressionData={geneExpressionData}
          scale={scale}
          replicates={replicates}
          viewBy={viewBy}
          RNAtype={RNAtype}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <GeneExpressionBarPlot
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onBarClicked={handleBarClick}
            />
          ),
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <GeneExpressionUMAP
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onSelectionChange={(points) => handlePointsSelected(points.map((x) => x.metaData))}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <GeneExpressionViolinPlot
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onViolinClicked={handleViolinClick}
              onPointClicked={handleViolinPointClick}
            />
          ),
        },
      ]}
    />
    </>
  );
};

export default GeneExpression;
