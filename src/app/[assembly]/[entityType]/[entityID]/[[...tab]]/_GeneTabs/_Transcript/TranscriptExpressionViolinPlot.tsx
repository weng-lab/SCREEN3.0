import { TranscriptExpressionProps, TranscriptMetadata, SharedTranscriptExpressionPlotProps } from "./TranscriptExpression";
import { useMemo } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPlotProps, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/lib/colors"
import TranscriptPlotControls from "./TranscriptPlotControls";

export type TranscriptExpressionViolinPlotProps = TranscriptExpressionProps &
    SharedTranscriptExpressionPlotProps &
    Partial<ViolinPlotProps<TranscriptMetadata>>

const TranscriptExpressionBarPlot = ({ 
    handleViewChange, 
    handlePeakChange, 
    handleScaleChange, 
    scale, 
    viewBy,
    geneData, 
    selectedPeak, 
    transcriptExpressionData, 
    selected, 
    sortedFilteredData, 
    ...rest 
}: TranscriptExpressionViolinPlotProps) => {

    const violinData: Distribution<TranscriptMetadata>[] = useMemo(() => {
        if (!sortedFilteredData) return [];

        const grouped = sortedFilteredData.reduce((acc, item) => {
            const key = item.organ;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, TranscriptMetadata[]>);

        return Object.entries(grouped).map(([tissue, group]) => {
            const values = group.map((d) => d.value);
            const label = tissue;
            const violinColor =
                selected.length === 0 || group.every((d) => selected.some((s) => s.expAccession === d.expAccession))
                    ? tissueColors[tissue] ?? tissueColors.missing
                    : "#CCCCCC"

            const data: ViolinPoint<TranscriptMetadata>[] = values.map((value, i) => {
                const metadata = group[i];
                const isSelected = selected.length === 0 || selected.some((s) => s.expAccession === metadata.expAccession) ? true : false;
                const pointColor = isSelected ? tissueColors[tissue] ?? tissueColors.missing : "#CCCCCC";
                const pointRadius = isSelected ? 4 : 2;

                return values.length < 3
                    ? { value, radius: pointRadius, tissue: tissue, metadata, color: pointColor }
                    : { value, radius: selected.length === 0 ? 2 : pointRadius, tissue: tissue, metadata, color: pointColor };
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
            <TranscriptPlotControls
                handleViewChange={handleViewChange}
                handlePeakChange={handlePeakChange}
                handleScaleChange={handleScaleChange}
                scale={scale}
                viewBy={viewBy}
                transcriptExpressionData={transcriptExpressionData}
                selectedPeak={selectedPeak}
            />
            <ViolinPlot
                {...rest}
                distributions={violinData}
                axisLabel={`Transcript Expression at ${selectedPeak} of ${geneData.data.name} (RPM)`}
                loading={transcriptExpressionData.loading}
                labelOrientation="leftDiagonal"
                violinProps={{
                    bandwidth: "scott",
                    showAllPoints: true,
                    jitter: 10,
                }}
                pointTooltipBody={(point) => {
                    const rpm = point.metadata?.value ?? 0;

                    return (
                        <Box maxWidth={300}>
                            {point.outlier && <div><strong>Outlier</strong></div>}
                            <div><strong>Sample:</strong> {point.metadata?.biosampleName}</div>
                            <div><strong>Tissue:</strong> {point.metadata?.organ}</div>
                            <div><strong>Strand:</strong> {point.metadata?.strand}</div>
                            <div><strong>RPM:</strong>{" "}{point.metadata?.value.toFixed(2)}</div>
                        </Box>
                    );
                }}
            />

        </Box>
    );
};

export default TranscriptExpressionBarPlot;
