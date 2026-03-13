import { useEffect, useMemo, useRef, useState } from "react";
import TwoPaneLayout, { TwoPanePlotConfig } from "common/components/TwoPaneLayout/TwoPaneLayout";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import AssayTable from "./AssayTable";
import AssayBarPlot from "./AssayBarPlot";
import AssayViolinPlot from "./AssayViolinPlot";
import AssayUMAP from "./AssayUMAP";
import { DownloadPlotHandle } from "@weng-lab/visualization";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type { AssayViewProps, BiosampleRow, ViewBy } from "./types";

/**
 * Applies the viewBy transformation to rows.
 * - "value": sort by assay z-score descending
 * - "tissue": group by tissue (sorted by max within tissue), then by score within group
 * - "tissueMax": keep only the max-scoring biosample per tissue, sort by score descending
 */
function applyViewByTransform(rows: BiosampleRow[], viewBy: ViewBy, assay: string): BiosampleRow[] {
  if (!rows) return [];

  let result = [...rows];

  switch (viewBy) {
    case "value": {
      result.sort((a, b) => b[assay] - a[assay]);
      break;
    }

    case "tissue": {
      const getTissue = (d: BiosampleRow) => d.ontology ?? "unknown";

      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item[assay]);
        return acc;
      }, {});

      result.sort((a, b) => {
        const tissueA = getTissue(a);
        const tissueB = getTissue(b);
        const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
        if (maxDiff !== 0) return maxDiff;
        return b[assay] - a[assay];
      });
      break;
    }

    case "tissueMax": {
      const getTissue = (d: BiosampleRow) => d.ontology ?? "unknown";

      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item[assay]);
        return acc;
      }, {});

      result = result.filter((item) => {
        const tissue = getTissue(item);
        return item[assay] === maxValuesByTissue[tissue];
      });

      result.sort((a, b) => b[assay] - a[assay]);
      break;
    }
  }

  return result;
}

const AssayView = (props: AssayViewProps) => {
  const [viewBy, setViewBy] = useState<ViewBy>("value");
  const [cutoffLowSignal, setCutoffLowSignal] = useState<boolean>(true);
  const [show95Line, setShow95Line] = useState<boolean>(true);

  const transformedRows = useMemo(
    () => applyViewByTransform(props.rows, viewBy, props.assay),
    [props.rows, viewBy, props.assay]
  );

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.name,
  });

  const barRef = useRef<DownloadPlotHandle>(null);
  const violinRef = useRef<DownloadPlotHandle>(null);
  const scatterRef = useRef<DownloadPlotHandle>(null);

  useEffect(() => {
    if (!props.assay) return;
    setSelected([]);
  }, [props.assay, setSelected]);

  const plots: TwoPanePlotConfig[] = useMemo(() => {
    const plotList: TwoPanePlotConfig[] = [
      {
        tabTitle: "Bar Plot",
        icon: <BarChart />,
        plotComponent: (
          <AssayBarPlot
            ref={barRef}
            sortedFilteredData={sortedFilteredData}
            selected={selected}
            toggleSelection={toggleSelection}
            assay={props.assay}
            entity={props.entity}
            viewBy={viewBy}
            setViewBy={setViewBy}
            cutoffLowSignal={cutoffLowSignal}
            setCutoffLowSignal={setCutoffLowSignal}
            show95Line={show95Line}
            setShow95Line={setShow95Line}
          />
        ),
        ref: barRef,
      },
      {
        tabTitle: "Violin Plot",
        icon: <CandlestickChart />,
        plotComponent: (
          <AssayViolinPlot
            ref={violinRef}
            rows={props.rows}
            selected={selected}
            setSelected={setSelected}
            toggleSelection={toggleSelection}
            assay={props.assay}
            entity={props.entity}
            viewBy={viewBy}
            setViewBy={setViewBy}
            cutoffLowSignal={cutoffLowSignal}
            setCutoffLowSignal={setCutoffLowSignal}
            show95Line={show95Line}
            setShow95Line={setShow95Line}
          />
        ),
        ref: violinRef,
      },
    ];
    if (!(props.assay === "atac")) {
      plotList.push({
        tabTitle: "UMAP",
        icon: <ScatterPlot />,
        plotComponent: (
          <AssayUMAP
            ref={scatterRef}
            rows={props.rows}
            selected={selected}
            setSelected={setSelected}
            toggleSelection={toggleSelection}
            assay={props.assay}
            entity={props.entity}
          />
        ),
        ref: scatterRef,
      });
    }
    return plotList;
  }, [
    props.assay,
    props.entity,
    props.rows,
    sortedFilteredData,
    selected,
    setSelected,
    toggleSelection,
    viewBy,
    cutoffLowSignal,
    setCutoffLowSignal,
    show95Line,
    setShow95Line,
  ]);

  return (
    <TwoPaneLayout
      TableComponent={
        <AssayTable
          rows={transformedRows}
          columns={props.columns}
          assay={props.assay}
          entity={props.entity}
          tableProps={tableProps}
          viewBy={viewBy}
        />
      }
      plots={plots}
    />
  );
};

export default AssayView;
