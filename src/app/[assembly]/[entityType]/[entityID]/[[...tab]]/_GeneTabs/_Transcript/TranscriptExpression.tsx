import { BarChart, CandlestickChart } from "@mui/icons-material";
import { BarData, Distribution, ViolinPoint } from "@weng-lab/visualization";
import TwoPaneLayout from "common/components/TwoPaneLayout";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { useTranscriptExpression, UseTranscriptExpressionReturn } from "common/hooks/useTranscriptExpression";
import { useEffect, useState, useMemo } from "react";
import TranscriptExpressionTable from "./TranscriptExpressionTable";
import TranscriptExpressionBarPlot from "./TranscriptExpressionBarPlot";
import TranscriptExpressionViolinPlot from "./TranscriptExpressionViolinPlot";

export type TranscriptMetadata = UseTranscriptExpressionReturn["data"][number];

export type SharedTranscriptExpressionPlotProps = {
    selected: TranscriptMetadata[];
    transcriptExpressionData: UseTranscriptExpressionReturn;
    sortedFilteredData: TranscriptMetadata[];
    selectedPeak: string;
    viewBy?: "value" | "tissue" | "tissueMax";
    scale?: "linear" | "log"
    handlePeakChange?: (newPeak: string) => void;
    handleViewChange?: (newView: "value" | "tissue" | "tissueMax") => void;
    handleScaleChange?: (newScale: "linear" | "log") => void;
};

export type TranscriptExpressionProps = {
    geneData: UseGeneDataReturn<{ name: string }>;
};

const TranscriptExpression = ({ geneData }: TranscriptExpressionProps) => {
    const [selected, setSelected] = useState<TranscriptMetadata[]>([]);
    const [peak, setPeak] = useState<string>("");
    const [viewBy, setViewBy] = useState<"value" | "tissue" | "tissueMax">("value")
    const [scale, setScale] = useState<"linear" | "log">("linear")
    const [sortedFilteredData, setSortedFilteredData] = useState<TranscriptMetadata[]>([]);

    const transcriptExpressionData = useTranscriptExpression({ gene: geneData?.data.name });

    useEffect(() => {
        if (transcriptExpressionData && peak === "") {
            setPeak(transcriptExpressionData.data?.[0]?.peakId ?? "");
        }
    }, [peak, transcriptExpressionData]);

    const handlePeakChange = (newPeak: string) => {
        setPeak(newPeak);
    };

    const handleViewChange = (newView: "value" | "tissue" | "tissueMax") => {
        console.log("view changed to ", newView)
        setViewBy(newView);
    };

    const handleScaleChange = (newScale: "linear" | "log") => {
        setScale(newScale);
    };

    const handleSelectionChange = (selected: TranscriptMetadata[]) => {
        setSelected(selected);
    };

    const handleBarClick = (bar: BarData<TranscriptMetadata>) => {
        if (selected.includes(bar.metadata)) {
            setSelected(selected.filter((x) => x !== bar.metadata));
        } else setSelected([...selected, bar.metadata]);
    };

    const handleViolinClick = (violin: Distribution<TranscriptMetadata>) => {
        const rowsForDistribution = violin.data.map((point) => point.metadata);

        const allInDistributionSelected = rowsForDistribution.every(row => selected.some(x => x.expAccession === row.expAccession))

        if (allInDistributionSelected) {
            setSelected((prev) => prev.filter((row) => !rowsForDistribution.some((x) => x.expAccession === row.expAccession)));
        } else {
            const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => x.expAccession === row.expAccession));
            setSelected((prev) => [...prev, ...toSelect]);
        }
    };

    const handleViolinPointClick = (point: ViolinPoint<TranscriptMetadata>) => {
        if (selected.includes(point.metadata)) {
            setSelected(selected.filter((x) => x !== point.metadata));
        } else setSelected([...selected, point.metadata]);
    };

    return (
        <TwoPaneLayout
            TableComponent={
                <TranscriptExpressionTable
                    geneData={geneData}
                    selected={selected}
                    onSelectionChange={handleSelectionChange}
                    sortedFilteredData={sortedFilteredData}
                    setSortedFilteredData={setSortedFilteredData}
                    transcriptExpressionData={transcriptExpressionData}
                    selectedPeak={peak}
                    viewBy={viewBy}
                    scale={scale}
                />
            }
            plots={[
                {
                    tabTitle: "Bar Plot",
                    icon: <BarChart />,
                    plotComponent: (
                        <TranscriptExpressionBarPlot
                            geneData={geneData}
                            transcriptExpressionData={transcriptExpressionData}
                            selected={selected}
                            sortedFilteredData={sortedFilteredData}
                            onBarClicked={handleBarClick}
                            selectedPeak={peak}
                            handlePeakChange={handlePeakChange}
                            handleViewChange={handleViewChange}
                            viewBy={viewBy}
                            scale={scale}
                            handleScaleChange={handleScaleChange}
                        />
                    ),
                },
                {
                    tabTitle: "Violin Plot",
                    icon: <CandlestickChart />,
                    plotComponent: (
                        <TranscriptExpressionViolinPlot
                            geneData={geneData}
                            selected={selected}
                            sortedFilteredData={sortedFilteredData}
                            transcriptExpressionData={transcriptExpressionData}
                            onViolinClicked={handleViolinClick}
                            onPointClicked={handleViolinPointClick}
                            selectedPeak={peak}
                            handlePeakChange={handlePeakChange}
                            handleViewChange={handleViewChange}
                            viewBy={viewBy}
                            scale={scale}
                            handleScaleChange={handleScaleChange}
                        />
                    ),
                },
            ]}
        />
    );
}

export default TranscriptExpression;