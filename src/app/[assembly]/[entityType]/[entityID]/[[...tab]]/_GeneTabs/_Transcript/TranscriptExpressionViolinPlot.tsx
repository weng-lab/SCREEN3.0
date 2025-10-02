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
    setSelected,
    scale,
    viewBy,
    geneData,
    selectedPeak,
    transcriptExpressionData,
    selected,
    rows,
    ...rest
}: TranscriptExpressionViolinPlotProps) => {

    const violinData: Distribution<TranscriptMetadata>[] = useMemo(() => {
        if (!rows) return [];

        const grouped = rows.reduce((acc, item) => {
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
    }, [selected, rows]);

    const onViolinClicked = (violin: Distribution<TranscriptMetadata>) => {
        const rowsForDistribution = violin.data.map((point) => point.metadata);

        const allInDistributionSelected = rowsForDistribution.every(row => selected.some(x => x.expAccession === row.expAccession))

        if (allInDistributionSelected) {
            setSelected(selected.filter((row) => !rowsForDistribution.some((x) => x.expAccession === row.expAccession)));
        } else {
            const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => x.expAccession === row.expAccession));
            setSelected([...selected, ...toSelect]);
        }
    };

    const onPointClicked = (point: ViolinPoint<TranscriptMetadata>) => {
        if (selected.includes(point.metadata)) {
            setSelected(selected.filter((x) => x !== point.metadata));
        } else setSelected([...selected, point.metadata]);
    };

    return (
        <Box
            width={"100%"}
            height={"100%"}
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
            <Box
                width={"100%"}
                height={"calc(100% - 63px)"} // bad fix for adjusting height to account for controls
            >
                <ViolinPlot
                    {...rest}
                    distributions={violinData}
                    axisLabel={`TSS Expression at ${selectedPeak} of ${geneData.data.name} (${scale === "log" ? "log₁₀RPM" : "RPM"})`}
                    loading={transcriptExpressionData.loading}
                    labelOrientation="leftDiagonal"
                    onViolinClicked={onViolinClicked}
                    onPointClicked={onPointClicked}
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
        </Box>
    );
};

export default TranscriptExpressionBarPlot;
