import { GeneExpressionUMAPProps, getLogTPM, getTPM, PointMetadata } from "./types";
import { Typography } from "@mui/material";
import { useMemo } from "react";
import { evenStops } from "@weng-lab/visualization";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import BiosampleUMAP, { type RampColoring } from "common/components/BiosampleUMAP/BiosampleUMAP";
import { sampleTypeField, tissueField, type CategoryField } from "common/components/BiosampleUMAP/fields";

const FIELDS: CategoryField<PointMetadata>[] = [tissueField("tissue"), sampleTypeField("biosample_type")];

/** YlOrRd at nine even steps, as the expression gradient has always been drawn. */
const EXPRESSION_STOPS = evenStops(Array.from({ length: 9 }, (_, i) => interpolateYlOrRd(i / 8)));

const RADIUS = { base: 4, selected: 6 };

const keyOf = (row: PointMetadata) => row.exp_accession;
const getX = (row: PointMetadata) => row.umap_1;
const getY = (row: PointMetadata) => row.umap_2;

/** log10(TPM + 1), or null where the experiment has no quantification for the gene. */
const logTPMOf = (row: PointMetadata) => {
  const value = getLogTPM(row);
  return Number.isFinite(value) ? value : null;
};

const formatLog = (value: number) => value.toFixed(2);

const TooltipBody = (row: PointMetadata) => (
  <>
    <Typography>
      <b>Accession:</b> {row.exp_accession}
    </Typography>
    <Typography>
      <b>Biosample:</b> {row.biosample}
    </Typography>
    <Typography>
      <b>Tissue:</b> {row.tissue}
    </Typography>
    <Typography>
      <b>Log₁₀(TPM + 1):</b> {getLogTPM(row).toFixed(2)}
    </Typography>
    <Typography>
      <b>TPM:</b> {getTPM(row).toFixed(2)}
    </Typography>
  </>
);

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
  const expression: RampColoring<PointMetadata> = useMemo(() => {
    const max = Math.max(0, ...rows.flatMap((row) => logTPMOf(row) ?? []));
    return {
      label: "Expression",
      unit: "Log₁₀(TPM + 1)",
      valueOf: logTPMOf,
      stops: EXPRESSION_STOPS,
      defaultRange: [0, max],
      adjustable: true,
      format: formatLog,
      notes: ["Colors follow log₁₀(TPM + 1), from 0 to the most highly expressed experiment by default."],
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
      tooltipBody={TooltipBody}
      radius={RADIUS}
      loading={loading}
      downloadFileName={`${geneName}_expression_UMAP`}
      animationGroupSize={15}
      ref={ref}
    />
  );
};

export default GeneExpressionUMAP;
