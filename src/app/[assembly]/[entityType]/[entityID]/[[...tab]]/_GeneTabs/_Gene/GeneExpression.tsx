"use client";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useMemo, useState } from "react";
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
import type { UseGeneExpressionReturn } from "common/hooks/useGeneExpression";
const getTissue = (d: PointMetadata) => d.tissue ?? "unknown";

/**
 * Flattens gene expression data into one row per sample.
 * Filters by RNAtype and handles replicate splitting/averaging. TPM values are always raw (unscaled).
 */
function buildRows(
  data: UseGeneExpressionReturn["data"],
  RNAtype: GeneExpressionRNAType,
  replicates: GeneExpressionReplicates
): PointMetadata[] {
  if (!data?.length) return [];

  const filteredData = data.filter((d) => RNAtype === "all" || d.assay_term_name === RNAtype);

  return filteredData.flatMap((entry) => {
    const files = entry.gene_quantification_files?.filter(Boolean) ?? [];

    if (replicates === "all") {
      return files.map((file, i) => {
        const quant = file.quantifications?.filter(Boolean)?.[0];
        const repLabel = files.length > 1 ? ` rep. ${i + 1}` : "";

        return {
          ...entry,
          accession: `${entry.accession}${repLabel}`,
          gene_quantification_files: [
            {
              ...file,
              quantifications: [{ ...quant, tpm: quant?.tpm }],
            },
          ],
        };
      });
    }

    // replicates === "mean"
    const allQuants = files.flatMap((file) => file.quantifications?.filter(Boolean) ?? []);
    if (!allQuants.length) return [];

    const avgTPM = allQuants.reduce((sum, q) => sum + q?.tpm, 0) / allQuants.length;

    return [
      {
        ...entry,
        gene_quantification_files: [
          {
            accession: files[0]?.accession,
            biorep: null,
            quantifications: [{ file_accession: "average", tpm: avgTPM }],
          },
        ],
      },
    ];
  });
}

/**
 * Applies the viewBy transformation to rows.
 * - "byExperimentTPM": sort by TPM descending
 * - "byTissueTPM": group by tissue (sorted by max TPM within tissue), then by TPM within group
 * - "byTissueMaxTPM": keep only the max-TPM experiment per tissue, sort by TPM descending
 */
function applyViewByTransform(rows: PointMetadata[], viewBy: GeneExpressionViewBy): PointMetadata[] {
  if (!rows.length) return [];

  let result = [...rows];

  switch (viewBy) {
    case "byExperimentTPM": {
      result.sort((a, b) => getTPM(b) - getTPM(a));
      break;
    }

    case "byTissueTPM": {
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, getTPM(item));
        return acc;
      }, {});

      result.sort((a, b) => {
        const tissueA = getTissue(a);
        const tissueB = getTissue(b);
        const maxDiff = maxValuesByTissue[tissueB] - maxValuesByTissue[tissueA];
        if (maxDiff !== 0) return maxDiff;
        return getTPM(b) - getTPM(a);
      });
      break;
    }

    case "byTissueMaxTPM": {
      const maxValuesByTissue = result.reduce<Record<string, number>>((acc, item) => {
        const tissue = getTissue(item);
        acc[tissue] = Math.max(acc[tissue] ?? -Infinity, getTPM(item));
        return acc;
      }, {});

      result = result.filter((item) => {
        const tissue = getTissue(item);
        return getTPM(item) === maxValuesByTissue[tissue];
      });

      result.sort((a, b) => getTPM(b) - getTPM(a));
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
    const files = geneExpressionData?.data?.[0]?.gene_quantification_files?.[0];
    const hasTpm = files?.quantifications?.[0]?.tpm !== undefined;
    return Boolean(geneExpressionData?.data?.length) && !hasTpm;
  }, [geneExpressionData?.data]);

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
    getRowId: (r) => r.accession,
  });

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
          viewBy={viewBy}
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
              entity={entity}
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
              entity={entity}
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
              entity={entity}
              rows={umapRows}
              selected={selected}
              setSelected={setSelected}
              toggleSelection={toggleSelection}
              loading={geneExpressionData.loading}
              getRowId={getRowId}
            />
          ),
        },
      ]}
    />
  );
};

export default GeneExpression;
