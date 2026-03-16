"use client";
import { BarChart, CandlestickChart } from "@mui/icons-material";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useTranscriptExpression } from "common/hooks/useTranscriptExpression";
import { useEffect, useState, useMemo } from "react";
import TranscriptExpressionTable from "./TranscriptExpressionTable";
import TranscriptExpressionBarPlot from "./TranscriptExpressionBarPlot";
import TranscriptExpressionViolinPlot from "./TranscriptExpressionViolinPlot";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type {
  TranscriptMetadata,
  TranscriptExpressionViewBy,
  TranscriptExpressionScale,
  TranscriptExpressionControlProps,
} from "./types";

function applyViewByTransform(rows: TranscriptMetadata[], viewBy: TranscriptExpressionViewBy): TranscriptMetadata[] {
  if (!rows.length) return [];

  let result = [...rows];

  switch (viewBy) {
    case "value": {
      result.sort((a, b) => b.value - a.value);
      break;
    }
    case "tissue": {
      const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item.value);
        return acc;
      }, {});
      result.sort((a, b) => {
        const tissueA = getTissue(a);
        const tissueB = getTissue(b);
        const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
        if (maxDiff !== 0) return maxDiff;
        return b.value - a.value;
      });
      break;
    }
    case "tissueMax": {
      const getTissue = (d: TranscriptMetadata) => d.organ ?? "unknown";
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, item.value);
        return acc;
      }, {});
      result = result.filter((item) => {
        const tissue = getTissue(item);
        return item.value === maxValuesByTissue[tissue];
      });
      result.sort((a, b) => b.value - a.value);
      break;
    }
  }

  return result;
}

const TranscriptExpression = ({ entity }: EntityViewComponentProps) => {
  const [peak, setPeak] = useState<string>("");
  const [viewBy, setViewBy] = useState<TranscriptExpressionViewBy>("value");
  const [scale, setScale] = useState<TranscriptExpressionScale>("linear");

  const transcriptExpressionData = useTranscriptExpression({ gene: entity.entityID });

  useEffect(() => {
    if (transcriptExpressionData && peak === "") {
      setPeak(transcriptExpressionData.data?.[0]?.peakId ?? "");
    }
  }, [peak, transcriptExpressionData]);

  const rows: TranscriptMetadata[] = useMemo(() => {
    if (!transcriptExpressionData?.data?.length) return [];

    let filteredData = transcriptExpressionData.data.filter((d) => d.peakId === peak);

    filteredData = filteredData.map((item) => ({
      ...item,
      value: scale === "log" ? Math.log10((item.value ?? 0) + 1) : (item.value ?? 0),
    }));

    return [...filteredData];
  }, [transcriptExpressionData, scale, peak]);

  const transformedRows = useMemo(() => applyViewByTransform(rows, viewBy), [rows, viewBy]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.expAccession,
  });

  const controlProps: TranscriptExpressionControlProps = {
    scale,
    setScale,
    viewBy,
    setViewBy,
    selectedPeak: peak,
    setPeak,
    transcriptExpressionData,
  };

  return (
    <TwoPaneLayout
      TableComponent={
        <TranscriptExpressionTable
          rows={transformedRows}
          transcriptExpressionData={transcriptExpressionData}
          tableProps={tableProps}
          viewBy={viewBy}
          scale={scale}
          selectedPeak={peak}
          setPeak={setPeak}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <TranscriptExpressionBarPlot
              sortedFilteredData={sortedFilteredData}
              selected={selected}
              toggleSelection={toggleSelection}
              entity={entity}
              {...controlProps}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <TranscriptExpressionViolinPlot
              rows={rows}
              selected={selected}
              setSelected={setSelected}
              toggleSelection={toggleSelection}
              entity={entity}
              {...controlProps}
            />
          ),
        },
      ]}
    />
  );
};

export default TranscriptExpression;
