import { BarChart } from "@mui/icons-material";
import { BarData } from "@weng-lab/visualization";
import { GenomicRegion } from "app/_utility/types";
import TwoPaneLayout from "common/components/TwoPaneLayout";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { useTranscriptExpression, UseTranscriptExpressionReturn } from "common/hooks/useTranscriptExpression";
import { useMemo, useState } from "react";
import TranscriptExpressionTable from "./TranscriptExpressionTable";
import TranscriptExpressionBarPlot from "./TranscriptExpressionBarPlot";

export type TranscriptMetadata = UseTranscriptExpressionReturn["data"][number];

export type SharedTranscriptExpressionPlotProps = {
    selected: TranscriptMetadata[];
    transcriptExpressionData: UseTranscriptExpressionReturn;
    sortedFilteredData: TranscriptMetadata[];
    selectedPeak: string;
};

export type TranscriptExpressionProps = {
    geneData: UseGeneDataReturn<{ name: string }>;
};

const TranscriptExpression = ({ geneData }: TranscriptExpressionProps) => {
    const [selected, setSelected] = useState<TranscriptMetadata[]>([]);
    const [sortedFilteredData, setSortedFilteredData] = useState<TranscriptMetadata[]>([]);

    const transcriptExpressionData = useTranscriptExpression({ gene: geneData?.data.name });

    const handleSelectionChange = (selected: TranscriptMetadata[]) => {
        setSelected(selected);
    };

    const handleBarClick = (bar: BarData<TranscriptMetadata>) => {
        if (selected.includes(bar.metadata)) {
            setSelected(selected.filter((x) => x !== bar.metadata));
        } else setSelected([...selected, bar.metadata]);
    };

    const firstPeakId = transcriptExpressionData.data?.[0]?.peakId ?? "";

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
                    selectedPeak={firstPeakId}
                />
            }
            plots={[
                {
                    tabTitle: "Bar Plot",
                    icon: <BarChart />,
                    plotComponent: (
                        <TranscriptExpressionBarPlot
                            transcriptExpressionData={transcriptExpressionData}
                            selected={selected}
                            sortedFilteredData={sortedFilteredData}
                            onBarClicked={handleBarClick}
                            selectedPeak={firstPeakId}
                        />
                    ),
                },
            ]}
        />
    );
}

export default TranscriptExpression;