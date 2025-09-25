import TwoPaneLayout from "../../../../../../../common/components/TwoPaneLayout";
import { useState } from "react";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { BarData } from "@weng-lab/visualization";
import { useGeneExpression, UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";
import { Distribution, ViolinPoint } from "@weng-lab/visualization";
import { Assembly } from "types/globalTypes";

export type PointMetadata = UseGeneExpressionReturn["data"][number];

export type SharedGeneExpressionPlotProps = {
  selected: PointMetadata[];
  geneExpressionData: UseGeneExpressionReturn;
  sortedFilteredData: PointMetadata[];
};

export type GeneExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string }>;
  assembly: Assembly;
};

const GeneExpression = ({ geneData, assembly }: GeneExpressionProps) => {
  const [selected, setSelected] = useState<PointMetadata[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<PointMetadata[]>([]);
  const [scale, setScale] = useState<"linearTPM" | "logTPM">("linearTPM")

  const geneExpressionData = useGeneExpression({ id: geneData?.data.id, assembly: assembly });

  const handleScaleChange = (newScale: "linearTPM" | "logTPM") => {
    setScale(newScale);
  }

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
    const rowsForDistribution = violin.data.map((point) => point.metadata);
    
    const allInDistributionSelected = rowsForDistribution.every(row => selected.some(x => x.accession === row.accession))

    if (allInDistributionSelected) {
      setSelected((prev) => prev.filter((row) => !rowsForDistribution.some((x) => x.accession === row.accession)));
    } else {
      const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => x.accession === row.accession));
      setSelected((prev) => [...prev, ...toSelect]);
    }
  };

  const handleViolinPointClick = (point: ViolinPoint<PointMetadata>) => {
    if (selected.includes(point.metadata)) {
      setSelected(selected.filter((x) => x !== point.metadata));
    } else setSelected([...selected, point.metadata]);
  };

  return (
    <TwoPaneLayout
      TableComponent={
        <GeneExpressionTable
          geneData={geneData}
          selected={selected}
          onSelectionChange={handleSelectionChange}
          sortedFilteredData={sortedFilteredData}
          setSortedFilteredData={setSortedFilteredData}
          geneExpressionData={geneExpressionData}
          assembly={assembly}
          scale={scale}
          onScaleChange={handleScaleChange}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <GeneExpressionBarPlot
              assembly={assembly}
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onBarClicked={handleBarClick}
              scale={scale}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <GeneExpressionViolinPlot
              assembly={assembly}
              geneData={geneData}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              geneExpressionData={geneExpressionData}
              onViolinClicked={handleViolinClick}
              onPointClicked={handleViolinPointClick}
            />
          ),
        },
        // Add back once query returns umap coordiantes
         {
           tabTitle: "UMAP",
           icon: <ScatterPlot />,
           plotComponent: (
             <GeneExpressionUMAP
               assembly={assembly}
               geneData={geneData}
               selected={selected}
               sortedFilteredData={sortedFilteredData}
               geneExpressionData={geneExpressionData}
               onSelectionChange={(points) => handlePointsSelected(points.map((x) => x.metaData))}
             />
           ),
         },
        
      ]}
    />
  );
};

export default GeneExpression;
