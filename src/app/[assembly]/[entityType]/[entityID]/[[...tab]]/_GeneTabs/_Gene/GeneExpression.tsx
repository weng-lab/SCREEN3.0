"use client";
import TwoPaneLayout from "common/components/TwoPaneLayout/TwoPaneLayout";
import { useMemo, useRef, useState } from "react";
import GeneExpressionTable from "./GeneExpressionTable";
import GeneExpressionUMAP from "./GeneExpressionUMAP";
import GeneExpressionBarPlot from "./GeneExpressionBarPlot";
import { useGeneExpression } from "common/hooks/useGeneExpression";
import { BarChart, CandlestickChart, ScatterPlot } from "@mui/icons-material";
import GeneExpressionViolinPlot from "./GeneExpressionViolinPlot";
import { DownloadPlotHandle } from "@weng-lab/visualization";
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

const getTPM = (d: PointMetadata) => d.gene_quantification_files?.[0]?.quantifications?.[0]?.tpm ?? 0;
const getTissue = (d: PointMetadata) => d.tissue ?? "unknown";

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

  const barRef = useRef<DownloadPlotHandle>(null);
  const violinRef = useRef<DownloadPlotHandle>(null);
  const scatterRef = useRef<DownloadPlotHandle>(null);

  const geneExpressionData = useGeneExpression({ id: geneData?.data?.id, assembly: entity.assembly, skip: !geneData });

  const isV40 = useMemo(() => {
    const files = geneExpressionData?.data?.[0]?.gene_quantification_files?.[0];
    const hasTpm = files?.quantifications?.[0]?.tpm !== undefined;
    return Boolean(geneExpressionData?.data?.length) && !hasTpm;
  }, [geneExpressionData?.data]);

  const rows: PointMetadata[] = useMemo(() => {
    if (!geneExpressionData?.data?.length || isV40) return [];

    const filteredData = geneExpressionData.data.filter((d) => RNAtype === "all" || d.assay_term_name === RNAtype);

    const result: PointMetadata[] = filteredData.flatMap((entry) => {
      const files = entry.gene_quantification_files?.filter(Boolean) ?? [];

      if (replicates === "all") {
        return files.flatMap((file, i) => {
          const quants = file.quantifications?.filter(Boolean) ?? [];
          const quant = quants[0];

          const rawTPM = quant?.tpm;
          const scaledTPM = scale === "logTPM" ? Math.log10(rawTPM + 1) : rawTPM;

          const repLabel = files.length > 1 ? ` rep. ${i + 1}` : "";
          const modifiedAccession = `${entry.accession}${repLabel}`;

          return {
            ...entry,
            accession: modifiedAccession,
            gene_quantification_files: [
              {
                ...file,
                quantifications: [
                  {
                    ...quant,
                    tpm: scaledTPM,
                  },
                ],
              },
            ],
          };
        });
      } else {
        // replicates === "mean"
        const allQuants = files.flatMap((file) => file.quantifications?.filter(Boolean) ?? []);
        if (!allQuants.length) return [];

        const avgTPM = allQuants.reduce((sum, q) => sum + q?.tpm, 0) / allQuants.length;

        const scaledTPM = scale === "logTPM" ? Math.log10(avgTPM + 1) : avgTPM;

        return [
          {
            ...entry,
            gene_quantification_files: [
              {
                accession: files[0]?.accession,
                biorep: null,
                quantifications: [
                  {
                    file_accession: "average",
                    tpm: scaledTPM,
                  },
                ],
              },
            ],
          },
        ];
      }
    });

    return result;
  }, [geneExpressionData.data, isV40, RNAtype, replicates, scale]);

  const transformedRows = useMemo(() => applyViewByTransform(rows, viewBy), [rows, viewBy]);

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection } = useTablePlotSync({
    rows: transformedRows,
    getRowId: (r) => r.accession,
  });

  const handleSetReplicates = (newReplicates: GeneExpressionReplicates) => {
    setSelected([]);
    setReplicates(newReplicates);
  };

  const controlProps: GeneExpressionControlProps = {
    scale,
    setScale,
    replicates,
    setReplicates: handleSetReplicates,
    viewBy,
    setViewBy,
    RNAtype,
    setRNAType,
  };

  return (
    <>
      {isV40 && <VersionFallback gene={entity.entityID} />}
      <TwoPaneLayout
        TableComponent={
          <GeneExpressionTable
            rows={transformedRows}
            entity={entity}
            geneExpressionData={geneExpressionData}
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
                ref={barRef}
                sortedFilteredData={sortedFilteredData}
                selected={selected}
                toggleSelection={toggleSelection}
                entity={entity}
                isV40={isV40}
                {...controlProps}
              />
            ),
            ref: barRef,
          },
          {
            tabTitle: "Violin Plot",
            icon: <CandlestickChart />,
            plotComponent: (
              <GeneExpressionViolinPlot
                ref={violinRef}
                rows={rows}
                selected={selected}
                setSelected={setSelected}
                toggleSelection={toggleSelection}
                entity={entity}
                geneExpressionData={geneExpressionData}
                {...controlProps}
              />
            ),
            ref: violinRef,
          },
          {
            tabTitle: "UMAP",
            icon: <ScatterPlot />,
            plotComponent: (
              <GeneExpressionUMAP
                ref={scatterRef}
                entity={entity}
                selected={selected}
                setSelected={setSelected}
                toggleSelection={toggleSelection}
                geneExpressionData={geneExpressionData}
              />
            ),
            ref: scatterRef,
          },
        ]}
        isV40={isV40}
      />
    </>
  );
};

export default GeneExpression;
