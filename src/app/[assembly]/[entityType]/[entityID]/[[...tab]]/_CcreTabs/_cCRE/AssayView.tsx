import { useEffect, useMemo, useRef, useState } from "react";
import TwoPaneLayout, { TwoPanePlotConfig } from "common/components/TwoPaneLayout/TwoPaneLayout";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import AssayTable from "./AssayTable";
import AssayBarPlot from "./AssayBarPlot";
import AssayViolinPlot from "./AssayViolinPlot";
import AssayUMAP from "./AssayUMAP";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import type { AssayViewProps, BiosampleRow, SharedAssayViewPlotProps } from "./types";

const AssayView = (props: AssayViewProps) => {
  const [selected, setSelected] = useState<BiosampleRow[]>([]);
  const [sortedFilteredData, setSortedFilteredData] = useState<BiosampleRow[]>([]);
  const [viewBy, setViewBy] = useState<"value" | "tissue" | "tissueMax">("value");
  const [cutoffLowSignal, setCutoffLowSignal] = useState<boolean>(true);

  const barRef = useRef<DownloadPlotHandle>(null);
  const violinRef = useRef<DownloadPlotHandle>(null);
  const scatterRef = useRef<DownloadPlotHandle>(null);

  useEffect(() => {
    if (!props.assay) return;
    setSelected([]);
  }, [props.assay]);

  const sharedAssayViewPlotProps: SharedAssayViewPlotProps = useMemo(
    () => ({
      selected,
      setSelected,
      sortedFilteredData,
      setSortedFilteredData,
      viewBy,
      setViewBy,
      cutoffLowSignal,
      setCutoffLowSignal,
      ...props,
    }),
    [cutoffLowSignal, props, selected, sortedFilteredData, viewBy]
  );

  const plots: TwoPanePlotConfig[] = useMemo(() => {
    const plots = [
      {
        tabTitle: "Bar Plot",
        icon: <BarChart />,
        plotComponent: <AssayBarPlot ref={barRef} {...sharedAssayViewPlotProps} />,
        ref: barRef,
      },
      {
        tabTitle: "Violin Plot",
        icon: <CandlestickChart />,
        plotComponent: <AssayViolinPlot ref={violinRef} {...sharedAssayViewPlotProps} />,
        ref: violinRef,
      },
    ];
    if (!(props.assay === "atac")) {
      plots.push({
        tabTitle: "UMAP",
        icon: <ScatterPlot />,
        plotComponent: <AssayUMAP ref={scatterRef} {...sharedAssayViewPlotProps} />,
        ref: scatterRef,
      });
    }
    return plots;
  }, [props.assay, sharedAssayViewPlotProps]);

  return <TwoPaneLayout TableComponent={<AssayTable {...sharedAssayViewPlotProps} />} plots={plots} />;
};

export default AssayView;
