"use client";
import { BarChart, CandlestickChart } from "@mui/icons-material";
import { TwoPaneLayout, useTablePlotSync } from "@weng-lab/ui-components";
import { usePlotDownload } from "common/hooks/ui";
import { useTranscriptExpression } from "common/hooks/data/gene";
import { useState, useMemo } from "react";
import TranscriptExpressionTable from "./TranscriptExpressionTable";
import TranscriptExpressionBarPlot from "./TranscriptExpressionBarPlot";
import TranscriptExpressionViolinPlot from "./TranscriptExpressionViolinPlot";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { getRPM } from "./types";
import type {
  TranscriptMetadata,
  TranscriptExpressionViewBy,
  TranscriptExpressionScale,
  TranscriptExpressionControlProps,
} from "./types";

function applyViewByTransform(rows: TranscriptMetadata[], viewBy: TranscriptExpressionViewBy): TranscriptMetadata[] {
  if (!rows.length) return [];

  if (viewBy === "value") return [...rows];

  const result = [...rows];

  const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
    const tissue = item.organ ?? "unknown";
    acc[tissue] = Math.max(acc[tissue] ?? -Infinity, getRPM(item));
    return acc;
  }, {});

  switch (viewBy) {
    /**
     * Group by tissue, sort groups by max RPM in group, and sort descending within groups.
     * Table sorting should be disabled when viewBy === "tissue", as this ordering
     * cannot be accomplished by DataGrid sort state alone.
     */
    case "tissue":
      result.sort((a, b) => {
        const tissueA = a.organ ?? "unknown";
        const tissueB = b.organ ?? "unknown";
        const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
        if (maxDiff !== 0) return maxDiff;
        return getRPM(b) - getRPM(a);
      });
      return result;

    // Keep only the max-RPM biosample per tissue
    case "tissueMax":
      return result.filter((item) => {
        const tissue = item.organ ?? "unknown";
        return getRPM(item) === maxValuesByTissue[tissue];
      });
  }
}

const TranscriptExpression = ({ entity }: EntityViewComponentProps) => {
  const [userPeak, setUserPeak] = useState<string | null>(null);
  const [viewBy, setViewBy] = useState<TranscriptExpressionViewBy>("value");
  const [scale, setScale] = useState<TranscriptExpressionScale>("linear");

  const transcriptExpressionData = useTranscriptExpression({ gene: entity.entityID });

  // Use user-selected peak if set, otherwise default to the first peak from data
  const peak = userPeak ?? transcriptExpressionData.data?.[0]?.peakId ?? "";

  const rows: TranscriptMetadata[] = useMemo(() => {
    if (!transcriptExpressionData?.data?.length) return [];
    return transcriptExpressionData.data.filter((d) => d.peakId === peak);
  }, [transcriptExpressionData, peak]);

  const transformedRows = useMemo(() => applyViewByTransform(rows, viewBy), [rows, viewBy]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.expAccession,
  });

  const handleSetViewBy = (newView: TranscriptExpressionViewBy) => {
    setSelected([]);
    setViewBy(newView);
  };

  const controlProps: TranscriptExpressionControlProps = {
    scale,
    setScale,
    viewBy,
    setViewBy: handleSetViewBy,
    selectedPeak: peak,
    setPeak: setUserPeak,
    transcriptExpressionData,
  };

  const { ref: barRef, ...barDownload } = usePlotDownload();
  const { ref: violinRef, ...violinDownload } = usePlotDownload();

  return (
    <TwoPaneLayout
      direction={{ xs: "column", lg: "row" }}
      TableComponent={
        <TranscriptExpressionTable
          rows={transformedRows}
          transcriptExpressionData={transcriptExpressionData}
          tableProps={tableProps}
          isPresorted={viewBy === "tissue"}
          scale={scale}
          selectedPeak={peak}
          setPeak={setUserPeak}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <TranscriptExpressionBarPlot
              ref={barRef}
              sortedFilteredData={sortedFilteredData}
              selected={selected}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
              geneName={entity.entityID}
              {...controlProps}
            />
          ),
          ...barDownload,
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <TranscriptExpressionViolinPlot
              ref={violinRef}
              rows={rows}
              selected={selected}
              setSelected={setSelected}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
              geneName={entity.entityID}
              {...controlProps}
            />
          ),
          ...violinDownload,
        },
      ]}
    />
  );
};

export default TranscriptExpression;
