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

export type TranscriptExpressionProps = {
    geneData: UseGeneDataReturn<{ name: string }>;
};

export type SharedTranscriptExpressionPlotProps = TranscriptExpressionProps & {
    selected: TranscriptMetadata[];
    setSelected: (selected: TranscriptMetadata[]) => void;
    sortedFilteredData: TranscriptMetadata[];
    setSortedFilteredData: (data: TranscriptMetadata[]) => void;
    transcriptExpressionData: UseTranscriptExpressionReturn;
    selectedPeak: string;
    viewBy: "value" | "tissue" | "tissueMax";
    scale: "linear" | "log"
    handlePeakChange: (newPeak: string) => void;
    handleViewChange: (newView: "value" | "tissue" | "tissueMax") => void;
    handleScaleChange: (newScale: "linear" | "log") => void;
};

const TranscriptExpression = (props: TranscriptExpressionProps) => {
    const [selected, setSelected] = useState<TranscriptMetadata[]>([]);
    const [peak, setPeak] = useState<string>("");
    const [viewBy, setViewBy] = useState<"value" | "tissue" | "tissueMax">("value")
    const [scale, setScale] = useState<"linear" | "log">("linear")
    const [sortedFilteredData, setSortedFilteredData] = useState<TranscriptMetadata[]>([]);

    const transcriptExpressionData = useTranscriptExpression({ gene: props.geneData?.data.name });

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

    const sharedAssayViewPlotProps: SharedTranscriptExpressionPlotProps = useMemo(
        () => ({
            selected,
            setSelected,
            sortedFilteredData,
            setSortedFilteredData,
            transcriptExpressionData,
            selectedPeak: peak,
            viewBy,
            scale,
            handlePeakChange,
            handleViewChange,
            handleScaleChange,
            ...props,
        }),
        [
            selected,
            setSelected,
            sortedFilteredData,
            setSortedFilteredData,
            transcriptExpressionData,
            peak,
            viewBy,
            scale,
            handlePeakChange,
            handleViewChange,
            handleScaleChange,
            props
        ]
    );

    return (
        <TwoPaneLayout
            TableComponent={
                <TranscriptExpressionTable {...sharedAssayViewPlotProps} />
            }
            plots={[
                {
                    tabTitle: "Bar Plot",
                    icon: <BarChart />,
                    plotComponent: (
                        <TranscriptExpressionBarPlot {...sharedAssayViewPlotProps} />
                    ),
                },
                {
                    tabTitle: "Violin Plot",
                    icon: <CandlestickChart />,
                    plotComponent: (
                        <TranscriptExpressionViolinPlot {...sharedAssayViewPlotProps} />
                    ),
                },
            ]}
        />
    );
}

export default TranscriptExpression;