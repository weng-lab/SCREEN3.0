import { useMemo, useState } from "react";
import { gql } from "common/types/generated";
import { useQuery } from "@apollo/client/react";
import { FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import BiosampleUMAP, { type RampColoring } from "common/components/BiosampleUMAP/BiosampleUMAP";
import {
  lifeStageField,
  sampleTypeField,
  tissueField,
  type CategoryField,
} from "common/components/BiosampleUMAP/fields";
import { formatAssay } from "common/assays";
import { CLASS_COLORS, CLASS_DESCRIPTIONS } from "common/ccre";
import { CcreAssay, CcreClass } from "common/types/globalTypes";
import type { BiosampleRow, AssayUMAPProps } from "./types";

const BIOSAMPLE_UMAP = gql(`
  query BiosampleUmap($assembly: String!, $assay: String!) {
    ccREBiosampleQuery(assay: [$assay], assembly: $assembly) {
      biosamples {
        name
        umap_coordinates(assay: $assay)
      }
    }
  }
`);

/** A biosample with its place on the assay's UMAP. */
type UmapRow = BiosampleRow & { umap: [number, number] };

const FIELDS: CategoryField<UmapRow>[] = [
  tissueField("ontology"),
  sampleTypeField("sampleType"),
  lifeStageField("lifeStage"),
  {
    column: "group",
    label: "Classification",
    colorOf: (value) => CLASS_COLORS[value as CcreClass],
    labelOf: (value) => CLASS_DESCRIPTIONS[value as CcreClass] ?? value,
  },
];

const RADIUS = { base: 2, selected: 4 };

/** The z-score past which a cCRE counts as active in a biosample. */
const ACTIVE_Z = 1.64;

/** Active only: the top half of RdYlBu from the cutoff up, with everything below it in the neutral. */
const ACTIVE_STOPS = [
  { at: 0, color: interpolateRdYlBu(0.5) },
  { at: 1, color: interpolateRdYlBu(0) },
];

/** All: RdYlBu either side of zero, blue low and red high. */
const ALL_STOPS = [
  { at: 0, color: interpolateRdYlBu(1) },
  { at: 0.5, color: interpolateRdYlBu(0.5) },
  { at: 1, color: interpolateRdYlBu(0) },
];

type ScoreMode = "active" | "all";

const keyOf = (row: UmapRow) => row.name;
const getX = (row: UmapRow) => row.umap[0];
const getY = (row: UmapRow) => row.umap[1];
const scoreOf = (row: UmapRow) => row.value ?? null;

/** "4", "-4", "1.64": no trailing zeros at the ends of the bar. */
const formatEnd = (value: number) => String(Number(value.toFixed(2)));
const formatScore = (value: number) => value.toFixed(2);

const TooltipBody = ({ row, assay }: { row: BiosampleRow; assay: CcreAssay }) => (
  <>
    <Typography>
      <b>Sample:</b> {row.displayname}
    </Typography>
    <Typography>
      <b>Organ/Tissue:</b> {row.ontology}
    </Typography>
    <Typography>
      <b>Sample Type:</b> {row.sampleType}
    </Typography>
    <Typography>
      <b>{formatAssay(assay)}:</b> {row[assay]?.toFixed(2)}
    </Typography>
  </>
);

const AssayUMAP = ({
  rows,
  assay,
  assembly,
  selected,
  setSelected,
  toggleSelection,
  getRowId,
  filters,
  columns,
  ref,
}: AssayUMAPProps) => {
  const [scoreMode, setScoreMode] = useState<ScoreMode>("active");

  const { data: data_umap, loading: loading_umap } = useQuery(BIOSAMPLE_UMAP, {
    variables: {
      assembly: assembly.toLowerCase(),
      assay,
    },
  });

  // The biosamples the UMAP places, which is every one with the assay.
  const umapRows: UmapRow[] = useMemo(() => {
    if (!rows || !data_umap) return [];
    const coordinates = new Map(
      (data_umap.ccREBiosampleQuery.biosamples ?? []).map((sample) => [sample.name, sample.umap_coordinates])
    );
    return rows.flatMap((row) => {
      const umap = coordinates.get(getRowId(row));
      return umap ? [{ ...row, umap: [umap[0] ?? 0, umap[1] ?? 0] as [number, number] }] : [];
    });
  }, [rows, data_umap, getRowId]);

  const selectedNames = useMemo(() => new Set(selected.map(getRowId)), [selected, getRowId]);

  const score = useMemo((): RampColoring<UmapRow> => {
    const controls = (
      <FormControl>
        <RadioGroup row value={scoreMode} onChange={(event) => setScoreMode(event.target.value as ScoreMode)}>
          <FormControlLabel value="active" control={<Radio size="small" />} label="Active Only" />
          <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
        </RadioGroup>
      </FormControl>
    );
    const shared = { label: "Z Score", valueOf: scoreOf, format: formatEnd, formatValue: formatScore, controls };
    return scoreMode === "active"
      ? {
          ...shared,
          stops: ACTIVE_STOPS,
          defaultRange: [ACTIVE_Z, 4],
          cutoff: { value: ACTIVE_Z, label: `Below ${ACTIVE_Z}` },
        }
      : { ...shared, stops: ALL_STOPS, kind: "diverging", defaultRange: [-4, 4], adjustable: true };
  }, [scoreMode]);

  return (
    <BiosampleUMAP
      rows={umapRows}
      keyOf={keyOf}
      x={getX}
      y={getY}
      fields={FIELDS}
      ramp={score}
      noun="biosample"
      filters={filters}
      columns={columns}
      selected={selectedNames}
      onPointClicked={toggleSelection}
      onLassoSelect={(picked) =>
        setSelected((prev) => {
          const alreadySelected = new Set(prev.map(getRowId));
          return [...prev, ...picked.filter((row) => !alreadySelected.has(getRowId(row)))];
        })
      }
      tooltipBody={(row) => <TooltipBody row={row} assay={assay} />}
      radius={RADIUS}
      loading={loading_umap}
      downloadFileName={`${assay}_UMAP`}
      animationGroupSize={assay === "ctcf" ? 15 : assay === "dnase" ? 65 : 30}
      ref={ref}
    />
  );
};

export default AssayUMAP;
