import { expressionTooltip, GeneExpressionUMAPProps, getLogTPM, getTPM, PointMetadata } from "./types";
import { useMemo } from "react";
import { percentileRange } from "@weng-lab/visualization";
import BiosampleUMAP, { type RampColoring } from "common/components/BiosampleUMAP/BiosampleUMAP";
import { sampleTypeField, tissueField, type CategoryField } from "common/components/BiosampleUMAP/fields";

const FIELDS: CategoryField<PointMetadata>[] = [tissueField("tissue"), sampleTypeField("biosample_type")];

const RADIUS = { base: 4, selected: 6 };

/** MOHD's embedding explorer ramp, stops as it has them. Its order is carried by hue: yellow is the lightest. */
const MOHD_RAMP = [
  { at: 0, color: "#2541b2" },
  { at: 0.34, color: "#35a6a0" },
  { at: 0.68, color: "#f6d55c" },
  { at: 1, color: "#d8422c" },
];

/** Percentile trimmed off each end for the default range. Values beyond take an end's color. */
const CLIP_PERCENTILE = 2;

const keyOf = (row: PointMetadata) => row.exp_accession;
const getX = (row: PointMetadata) => row.umap_1;
const getY = (row: PointMetadata) => row.umap_2;

/** log10(TPM + 1), or null where the experiment has no quantification for the gene. */
const logTPMOf = (row: PointMetadata) => {
  const value = getLogTPM(row);
  return Number.isFinite(value) ? value : null;
};

const fromLogTPM = (log: number) => 10 ** log - 1;

const formatTpm = (tpm: number) => `${tpm.toLocaleString("en-US", { maximumFractionDigits: 2 })} TPM`;

/** An end of the bar falls between values, so only its magnitude matters. */
const formatTpmBound = (tpm: number) => `${tpm.toLocaleString("en-US", { maximumSignificantDigits: 2 })} TPM`;

/** Raw TPM whatever the other plots' scale: the UMAP is kept apart from their controls. */
const tooltip = (row: PointMetadata) => expressionTooltip(row, getTPM(row), "linearTPM");

const GeneExpressionUMAP = ({
  geneName,
  rows,
  selectedAccessions,
  filters,
  isListed,
  columns,
  onPointToggle,
  onLassoSelect,
  loading,
  ref,
}: GeneExpressionUMAPProps) => {
  // Scaled in log10, but the bar's ends and a sweep read in TPM.
  const expression: RampColoring<PointMetadata> = useMemo(() => {
    const values = Float64Array.from(rows.flatMap((row) => logTPMOf(row) ?? [])).sort();
    return {
      label: "Expression",
      valueOf: logTPMOf,
      stops: MOHD_RAMP,
      defaultRange: values.length > 0 ? percentileRange(values, CLIP_PERCENTILE) : [0, 0],
      adjustable: true,
      format: (log) => formatTpmBound(fromLogTPM(log)),
      formatValue: (log) => formatTpm(fromLogTPM(log)),
      notes: [
        "On a log scale: colors follow log₁₀(TPM + 1).",
        `Starts at the middle ${100 - 2 * CLIP_PERCENTILE}% of experiments, so a few extreme values don't wash out the rest.`,
      ],
    };
  }, [rows]);

  return (
    <BiosampleUMAP
      rows={rows}
      keyOf={keyOf}
      x={getX}
      y={getY}
      fields={FIELDS}
      ramp={expression}
      noun="experiment"
      filters={filters}
      isListed={isListed}
      columns={columns}
      selected={selectedAccessions}
      onPointClicked={onPointToggle}
      onLassoSelect={onLassoSelect}
      tooltip={tooltip}
      radius={RADIUS}
      loading={loading}
      downloadFileName={`${geneName}_expression_UMAP`}
      animationGroupSize={15}
      ref={ref}
    />
  );
};

export default GeneExpressionUMAP;
