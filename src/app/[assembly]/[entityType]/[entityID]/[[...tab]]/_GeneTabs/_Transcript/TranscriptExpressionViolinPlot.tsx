import { TranscriptExpressionProps, TranscriptMetadata, SharedTranscriptExpressionPlotProps } from "./TranscriptExpression";
import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Distribution, ViolinPlot, ViolinPlotProps, ViolinPoint } from "@weng-lab/visualization";
import { tissueColors } from "common/lib/colors"
import TranscriptPlotControls from "./TranscriptPlotControls";

export type TranscriptExpressionViolinPlotProps = TranscriptExpressionProps &
    SharedTranscriptExpressionPlotProps &
    Partial<ViolinPlotProps<TranscriptMetadata>>

const TranscriptExpressionBarPlot = ({
    setViewBy,
    setPeak,
    setScale,
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
    const [sortBy, setSortBy] = useState<"median" | "max" | "tissue">("max")
    const [showPoints, setShowPoints] = useState<boolean>(true);

    const violinData: Distribution<TranscriptMetadata>[] = useMemo(() => {
        if (!rows) return [];

        const grouped = rows.reduce((acc, item) => {
            const key = item.organ;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, TranscriptMetadata[]>);

        let distributions = Object.entries(grouped).map(([tissue, group]) => {
            const values = group.map((d) => d.value);
            const label = tissue;
            const violinColor =
                selected.length === 0 || group.every((d) => selected.some((s) => s.expAccession === d.expAccession))
                    ? tissueColors[tissue] ?? tissueColors.missing
                    : "#CCCCCC";

            const data: ViolinPoint<TranscriptMetadata>[] = values.map((value, i) => {
                const metadata = group[i];
                const isSelected =
                    selected.length === 0 || selected.some((s) => s.expAccession === metadata.expAccession);
                const pointColor = isSelected ? tissueColors[tissue] ?? tissueColors.missing : "#CCCCCC";
                const pointRadius = isSelected ? 4 : 2;

                return values.length < 3
                    ? { value, radius: pointRadius, tissue, metadata, color: pointColor }
                    : { value, radius: selected.length === 0 ? 2 : pointRadius, tissue, metadata, color: pointColor };
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
                    return sorted.length % 2 !== 0
                        ? sorted[mid]
                        : (sorted[mid - 1] + sorted[mid]) / 2;
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
        const id = point.metadata.expAccession;
        if (selected.some((x) => x.expAccession === id)) {
            setSelected(selected.filter((x) => x.expAccession !== id));
        } else {
            setSelected([...selected, point.metadata]);
        }
    };


    return (
        <Box
            width={"100%"}
            height={"100%"}
            padding={1}
            sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
        >
            <TranscriptPlotControls
                setViewBy={setViewBy}
                setPeak={setPeak}
                setScale={setScale}
                setSortBy={setSortBy}
                setShowPoints={setShowPoints}
                showPoints={showPoints}
                scale={scale}
                viewBy={viewBy}
                sortBy={sortBy}
                transcriptExpressionData={transcriptExpressionData}
                selectedPeak={selectedPeak}
                violin={true}
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
                        showAllPoints: showPoints,
                        jitter: 10,
                    }}
                    crossProps={{
                        outliers: showPoints ? "all" : "none",
                    }}
                    pointTooltipBody={(point) => {
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
