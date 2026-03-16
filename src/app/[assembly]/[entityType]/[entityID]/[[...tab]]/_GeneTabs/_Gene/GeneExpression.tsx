"use client";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useCallback, useMemo, useState } from "react";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { useGeneExpression } from "common/hooks/useGeneExpression";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";
import VersionFallback from "./GeneVersionFallback";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { useGeneData } from "common/hooks/useGeneData";
import { useTablePlotSync } from "common/hooks/useTablePlotSync";
import type {
  PointMetadata,
  GeneExpressionViewBy,
  GeneExpressionScale,
  GeneExpressionReplicates,
  GeneExpressionRNAType,
  GeneExpressionControlProps,
} from "./types";
import { getTPM } from "./types";
/**
 * Flattens gene expression data into one row per sample.
 * Filters by RNAtype and handles replicate splitting/averaging. TPM values are always raw (unscaled).
 */
function buildRows(
  data: ReturnType<typeof useGeneExpression>["data"],
  RNAtype: GeneExpressionRNAType,
  handleReplicates: GeneExpressionReplicates
): PointMetadata[] {
  if (!data?.length) return [];

  //filter by rna type
  const filteredData = data.filter((d) => RNAtype === "all" || d.assay_term_name === RNAtype);

  return filteredData.flatMap((biosample) => {
    const replicates = biosample.replicates;

    // If including all replicates, create entry for each replicate
    if (handleReplicates === "all") {
      return replicates.map((rep) => {
        return {
          ...biosample,
          ...rep,
        };
      });
    } else {
      // replicates === "mean"
      const avgTPM = biosample.replicates.reduce((total, rep) => total + rep.tpm, 0) / biosample.replicates.length;

      return [
        {
          ...biosample,
          file_accession: null,
          biorep: null,
          techrep: null,
          tpm: avgTPM,
        },
      ];
    }
  });
}

/**
 * Applies the viewBy transformation to rows.
 * - "byExperimentTPM": no sort/filter needed
 * - "byTissueTPM": group by tissue (sorted by max TPM within tissue), then by TPM within group
 * - "byTissueMaxTPM": keep only the max-TPM experiment per tissue
 */
function applyViewByTransform(rows: PointMetadata[], viewBy: GeneExpressionViewBy): PointMetadata[] {
  if (!rows.length) return [];

  let result = [...rows];

  switch (viewBy) {
    // No sorting required. useAutoSort in Table handles resetting initial sort
    case "byExperimentTPM": {
      break;
    }

    /**
     * Group by tissue, sort groups by max tpm in group, and sort descending within groups.
     * Table sorting should be disabled when viewBy === "byTissueTPM", as this ordering
     * cannot be accomplished by DataGrid sort state alone.
     */
    case "byTissueTPM": {
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        acc[item.tissue] = Math.max(acc[item.tissue] ?? -Infinity, getTPM(item));
        return acc;
      }, {});

      result.sort((a, b) => {
        const maxDiff = maxValuesByTissue[b.tissue] - maxValuesByTissue[a.tissue];
        if (maxDiff !== 0) return maxDiff;
        return getTPM(b) - getTPM(a);
      });
      break;
    }

    // Filter out all but max tpm samples for each tissue
    case "byTissueMaxTPM": {
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        acc[item.tissue] = Math.max(acc[item.tissue] ?? -Infinity, getTPM(item));
        return acc;
      }, {});

      result = result.filter((item) => getTPM(item) === maxValuesByTissue[item.tissue]);

      break;
    }
  }

  return result;
}

const GeneExpression = ({ entity }: EntityViewComponentProps) => {
  const geneData = useGeneData({ name: entity.entityID, assembly: entity.assembly });

  const [scale, setScale] = useState<GeneExpressionScale>("linearTPM");
  const [replicates, setReplicates] = useState<GeneExpressionReplicates>("mean");
  const [viewBy, setViewBy] = useState<GeneExpressionViewBy>("byExperimentTPM");
  const [RNAtype, setRNAType] = useState<GeneExpressionRNAType>(entity.assembly === "GRCh38" ? "total RNA-seq" : "all");

  const geneExpressionData = useGeneExpression({ id: geneData?.data?.id, assembly: entity.assembly, skip: !geneData });

  const isV40 = useMemo(() => {
    if (!geneExpressionData.data) return false;
    return geneExpressionData?.data?.[0]?.replicates?.[0]?.tpm === undefined;
  }, [geneExpressionData.data]);

  /**
   * Flattens gene expression experiments into a row-per-sample array.
   * Handles RNAtype filtering and replicate aggregation. TPM values are always raw (unscaled).
   */
  const rows: PointMetadata[] = useMemo(
    () => buildRows(geneExpressionData.data, RNAtype, replicates),
    [geneExpressionData.data, RNAtype, replicates]
  );

  /** UMAP always uses mean replicates and all RNA types (each experiment has one x/y coordinate) */
  const umapRows: PointMetadata[] = useMemo(
    () => buildRows(geneExpressionData.data, "all", "mean"),
    [geneExpressionData.data]
  );

  const transformedRows = useMemo(() => applyViewByTransform(rows, viewBy), [rows, viewBy]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.file_accession ?? r.exp_accession,
  });

  /** Set of experiment accessions (ENCSR) that have at least one replicate selected */
  const umapHighlightedAccessions = useMemo(() => {
    if (!selected.length) return new Set<string>();
    return new Set(selected.map((s) => s.exp_accession));
  }, [selected]);

  /** Toggle all replicates for a given experiment when clicking a UMAP point */
  const handleUmapToggle = useCallback(
    (item: PointMetadata) => {
      const experimentAccession = item.exp_accession;
      const replicateRows = rows.filter((r) => r.exp_accession === experimentAccession);
      const allSelected = replicateRows.every((r) => selected.some((s) => getRowId(s) === getRowId(r)));
      if (allSelected) {
        const replicateIds = new Set(replicateRows.map(getRowId));
        setSelected(selected.filter((s) => !replicateIds.has(getRowId(s))));
      } else {
        const alreadySelected = new Set(selected.map(getRowId));
        const toAdd = replicateRows.filter((r) => !alreadySelected.has(getRowId(r)));
        setSelected([...selected, ...toAdd]);
      }
    },
    [rows, selected, setSelected, getRowId]
  );

  /** Select all replicates for each experiment lassoed in UMAP */
  const handleUmapLassoSelect = useCallback(
    (items: PointMetadata[]) => {
      const experimentAccessions = new Set(items.map((item) => item.exp_accession));
      const replicateRows = rows.filter((r) => experimentAccessions.has(r.exp_accession));
      const alreadySelected = new Set(selected.map(getRowId));
      const toAdd = replicateRows.filter((r) => !alreadySelected.has(getRowId(r)));
      setSelected([...selected, ...toAdd]);
    },
    [rows, selected, setSelected, getRowId]
  );

  const handleSetReplicates = (newReplicates: GeneExpressionReplicates) => {
    setSelected([]);
    setReplicates(newReplicates);
  };

  const handleSetRNAType = (newType: GeneExpressionRNAType) => {
    setSelected([]);
    setRNAType(newType);
  };

  const handleSetViewBy = (newView: GeneExpressionViewBy) => {
    setSelected([]);
    setViewBy(newView);
  };

  const controlProps: GeneExpressionControlProps = {
    scale,
    setScale,
    replicates,
    setReplicates: handleSetReplicates,
    viewBy,
    setViewBy: handleSetViewBy,
    RNAtype,
    setRNAType: handleSetRNAType,
  };

  if (isV40) return <VersionFallback gene={entity.entityID} />;

  return (
    <TwoPaneLayout
      TableComponent={
        <GeneExpressionTable
          rows={transformedRows}
          label={`${entity.entityID} Expression`}
          loading={geneExpressionData.loading}
          error={!!geneExpressionData.error}
          tableProps={tableProps}
          isPresorted={viewBy === "byTissueTPM"}
          scale={scale}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <GeneExpressionBarPlot
              sortedFilteredData={sortedFilteredData}
              selected={selected}
              toggleSelection={toggleSelection}
              geneName={entity.entityID}
              assembly={entity.assembly}
              getRowId={getRowId}
              {...controlProps}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <GeneExpressionViolinPlot
              rows={rows}
              selected={selected}
              setSelected={setSelected}
              toggleSelection={toggleSelection}
              geneName={entity.entityID}
              assembly={entity.assembly}
              loading={geneExpressionData.loading}
              getRowId={getRowId}
              {...controlProps}
            />
          ),
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <GeneExpressionUMAP
              geneName={entity.entityID}
              rows={umapRows}
              highlightedAccessions={umapHighlightedAccessions}
              onPointToggle={handleUmapToggle}
              onLassoSelect={handleUmapLassoSelect}
              loading={geneExpressionData.loading}
            />
          ),
        },
      ]}
    />
  );
};

export default GeneExpression;
