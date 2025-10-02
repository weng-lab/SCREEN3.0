import { BarChart, CandlestickChart } from "@mui/icons-material";
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
    rows: TranscriptMetadata[];
    selected: TranscriptMetadata[];
    setSelected: (selected: TranscriptMetadata[]) => void;
    sortedFilteredData: TranscriptMetadata[];
    setSortedFilteredData: (data: TranscriptMetadata[]) => void;
    transcriptExpressionData: UseTranscriptExpressionReturn;
    selectedPeak: string;
    viewBy: "value" | "tissue" | "tissueMax";
    scale: "linear" | "log"
    setPeak: (newPeak: string) => void;
    setViewBy: (newView: "value" | "tissue" | "tissueMax") => void;
    setScale: (newScale: "linear" | "log") => void;
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

    const rows: TranscriptMetadata[] = useMemo(() => {
        if (!transcriptExpressionData?.data?.length) return [];

        //filter out the selected peak
        let filteredData = transcriptExpressionData.data.filter(d => d.peakId === peak);

        // Apply scaling to each item’s value
        filteredData = filteredData.map((item) => ({
            ...item,
            value: scale === "log"
                ? Math.log10((item.value ?? 0) + 1)
                : item.value ?? 0,
        }));

        return [...filteredData];
    }, [transcriptExpressionData, scale, peak]);

    const sharedAssayViewPlotProps: SharedTranscriptExpressionPlotProps = useMemo(
        () => ({
            rows,
            selected,
            setSelected,
            sortedFilteredData,
            setSortedFilteredData,
            transcriptExpressionData,
            selectedPeak: peak,
            viewBy,
            scale,
            setPeak,
            setViewBy,
            setScale,
            ...props,
        }),
        [
            rows,
            selected,
            setSelected,
            sortedFilteredData,
            setSortedFilteredData,
            transcriptExpressionData,
            peak,
            viewBy,
            scale,
            setPeak,
            setViewBy,
            setScale,
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