import { useEffect, useMemo, useState } from "react";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import AssayTable from "./AssayTable";
import AssayBarPlot from "./AssayBarPlot";
import AssayViolinPlot from "./AssayViolinPlot";
import AssayUMAP from "./AssayUMAP";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type { AssayViewProps, BiosampleRow, ViewBy } from "./types";

/**
 * Applies the viewBy transformation to rows.
 * - "value": no sort/filter needed
 * - "tissue": group by tissue (sorted by max within tissue), then by score within group
 * - "tissueMax": keep only the max-scoring biosample per tissue
 */
function applyViewByTransform(rows: BiosampleRow[], viewBy: ViewBy, assay: string): BiosampleRow[] {
  if (!rows) return [];

  // No sorting required. useAutoSort in Table handles resetting initial sort
  if (viewBy === "value") return [...rows];

  const result = [...rows];

  const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
    acc[item.ontology] = Math.max(acc[item.ontology] ?? -Infinity, item[assay]);
    return acc;
  }, {});

  switch (viewBy) {
    /**
     * Group by tissue, sort groups by max score in group, and sort descending within groups.
     * Table sorting should be disabled when viewBy === "tissue", as this ordering
     * cannot be accomplished by DataGrid sort state alone.
     */
    case "tissue":
      result.sort((a, b) => {
        const maxDiff = maxValuesByTissue[b.ontology] - maxValuesByTissue[a.ontology];
        if (maxDiff !== 0) return maxDiff;
        return b[assay] - a[assay];
      });
      return result;

    // Keep only the max-scoring biosample per tissue
    case "tissueMax":
      return result.filter((item) => item[assay] === maxValuesByTissue[item.ontology]);
  }
}

const AssayView = ({ rows, columns, assay, entity }: AssayViewProps) => {
  const { entityID } = entity;
  const { assembly } = entity;

  const [viewBy, setViewBy] = useState<ViewBy>("value");
  const [cutoffLowSignal, setCutoffLowSignal] = useState<boolean>(true);
  const [show95Line, setShow95Line] = useState<boolean>(true);

  const transformedRows = useMemo(() => applyViewByTransform(rows, viewBy, assay), [rows, viewBy, assay]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.name,
  });

  useEffect(() => {
    if (!assay) return;
    setSelected([]);
  }, [assay, setSelected]);

  const handleSetViewBy = (newView: ViewBy) => {
    setSelected([]);
    setViewBy(newView);
  };

  return (
    <TwoPaneLayout
      TableComponent={
        <AssayTable
          rows={transformedRows}
          columns={columns}
          assay={assay}
          entityID={entityID}
          tableProps={tableProps}
          isPresorted={viewBy === "tissue"}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <AssayBarPlot
              sortedFilteredData={sortedFilteredData}
              selected={selected}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
              assay={assay}
              entityID={entityID}
              viewBy={viewBy}
              setViewBy={handleSetViewBy}
              cutoffLowSignal={cutoffLowSignal}
              setCutoffLowSignal={setCutoffLowSignal}
              show95Line={show95Line}
              setShow95Line={setShow95Line}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <AssayViolinPlot
              rows={rows}
              selected={selected}
              setSelected={setSelected}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
              assay={assay}
              entityID={entityID}
              viewBy={viewBy}
              setViewBy={handleSetViewBy}
              cutoffLowSignal={cutoffLowSignal}
              setCutoffLowSignal={setCutoffLowSignal}
              show95Line={show95Line}
              setShow95Line={setShow95Line}
            />
          ),
        },
        ...(assay !== "atac"
          ? [
              {
                tabTitle: "UMAP",
                icon: <ScatterPlot />,
                plotComponent: (
                  <AssayUMAP
                    rows={rows}
                    selected={selected}
                    setSelected={setSelected}
                    toggleSelection={toggleSelection}
                    getRowId={getRowId}
                    assay={assay}
                    assembly={assembly}
                  />
                ),
              },
            ]
          : []),
      ]}
    />
  );
};

export default AssayView;
