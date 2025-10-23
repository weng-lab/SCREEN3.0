import { BarChart, CandlestickChart } from "@mui/icons-material";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { UseGeneDataReturn } from "common/hooks/useGeneData";
import { useTranscriptExpression, UseTranscriptExpressionReturn } from "common/hooks/useTranscriptExpression";
import { useEffect, useState, useMemo, useRef } from "react";
import TranscriptExpressionTable from "./TranscriptExpressionTable";
import TranscriptExpressionBarPlot from "./TranscriptExpressionBarPlot";
import TranscriptExpressionViolinPlot from "./TranscriptExpressionViolinPlot";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import { Assembly } from "common/types/globalTypes";

export type TranscriptMetadata = UseTranscriptExpressionReturn["data"][number];

export type TranscriptExpressionProps = {
  geneData: UseGeneDataReturn<{ name: string; assembly: Assembly }>;
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
  scale: "linear" | "log";
  setPeak: (newPeak: string) => void;
  setViewBy: (newView: "value" | "tissue" | "tissueMax") => void;
  setScale: (newScale: "linear" | "log") => void;
  ref?: React.RefObject<DownloadPlotHandle>;
};

const TranscriptExpression = (props: TranscriptExpressionProps) => {
  const [selected, setSelected] = useState<TranscriptMetadata[]>([]);
  const [peak, setPeak] = useState<string>("");
  const [viewBy, setViewBy] = useState<"value" | "tissue" | "tissueMax">("value");
  const [scale, setScale] = useState<"linear" | "log">("linear");
  const [sortedFilteredData, setSortedFilteredData] = useState<TranscriptMetadata[]>([]);

  const barRef = useRef<DownloadPlotHandle>(null);
  const violinRef = useRef<DownloadPlotHandle>(null);

  const transcriptExpressionData = useTranscriptExpression({ gene: props.geneData?.data.name });

  useEffect(() => {
    if (transcriptExpressionData && peak === "") {
      setPeak(transcriptExpressionData.data?.[0]?.peakId ?? "");
    }
  }, [peak, transcriptExpressionData]);

  const rows: TranscriptMetadata[] = useMemo(() => {
    if (!transcriptExpressionData?.data?.length) return [];

    //filter out the selected peak
    let filteredData = transcriptExpressionData.data.filter((d) => d.peakId === peak);

    // Apply scaling to each item’s value
    filteredData = filteredData.map((item) => ({
      ...item,
      value: scale === "log" ? Math.log10((item.value ?? 0) + 1) : (item.value ?? 0),
    }));

    return [...filteredData];
  }, [transcriptExpressionData, scale, peak]);

  const SharedTranscriptExpressionPlotProps: SharedTranscriptExpressionPlotProps = useMemo(
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
      props,
    ]
  );

  return (
    <TwoPaneLayout
      TableComponent={<TranscriptExpressionTable {...SharedTranscriptExpressionPlotProps} />}
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: <TranscriptExpressionBarPlot ref={barRef} {...SharedTranscriptExpressionPlotProps} />,
          ref: barRef,
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: <TranscriptExpressionViolinPlot ref={violinRef} {...SharedTranscriptExpressionPlotProps} />,
          ref: violinRef,
        },
      ]}
    />
  );
};

export default TranscriptExpression;
