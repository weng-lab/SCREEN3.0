import { useMemo } from "react";
import { gql } from "common/types/generated";
import { useQuery } from "@apollo/client/react";
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material";
import { interpolateRdYlBu } from "d3-scale-chromatic";
import BiosampleUMAP, { type RampColoring } from "common/components/BiosampleUMAP/BiosampleUMAP";
import {
  lifeStageField,
  sampleTypeField,
  tissueField,
  type CategoryField,
} from "common/components/BiosampleUMAP/fields";
import { CLASS_COLORS, CLASS_DESCRIPTIONS } from "common/ccre";
import { CcreClass } from "common/types/globalTypes";
import { formatAssay } from "common/assays";
import { ACTIVE_Z, activeOnlyState, withActiveOnly } from "./activeFilter";
import { biosampleTooltip, SCORE_FIELD, type BiosampleRow, type AssayUMAPProps } from "./types";

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

/** The score column, whose filter the Active only checkbox shows while it's on. */
const CONTROLLED_COLUMNS = [SCORE_FIELD];

const keyOf = (row: UmapRow) => row.name;
const getX = (row: UmapRow) => row.umap[0];
const getY = (row: UmapRow) => row.umap[1];
const scoreOf = (row: UmapRow) => row.value ?? null;

/** "4", "-4", "1.64": no trailing zeros at the ends of the bar. */
const formatEnd = (value: number) => String(Number(value.toFixed(2)));
const formatScore = (value: number) => value.toFixed(2);

/** RdYlBu either side of zero, blue low and red high. */
const SCORE: RampColoring<UmapRow> = {
  label: "Z Score",
  valueOf: scoreOf,
  stops: [
    { at: 0, color: interpolateRdYlBu(1) },
    { at: 0.5, color: interpolateRdYlBu(0.5) },
    { at: 1, color: interpolateRdYlBu(0) },
  ],
  kind: "diverging",
  defaultRange: [-4, 4],
  adjustable: true,
  format: formatEnd,
  formatValue: formatScore,
};

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

  const activeOnly = activeOnlyState(filters.model);
  const activeOnlyControl = (
    <Tooltip
      title={
        activeOnly === "other"
          ? `The table filters ${formatAssay(assay)} another way. Remove that filter to use this.`
          : `List only the biosamples where this cCRE is active (Z ≥ ${ACTIVE_Z}) in the table and plots`
      }
    >
      <FormControlLabel
        label="Active only"
        control={
          <Checkbox
            size="small"
            checked={activeOnly === "on"}
            // On the checkbox, not the label, so the label still shows the tooltip.
            disabled={activeOnly === "other"}
            onChange={(event) => filters.setModel((model) => withActiveOnly(model, event.target.checked))}
          />
        }
      />
    </Tooltip>
  );

  return (
    <BiosampleUMAP
      rows={umapRows}
      keyOf={keyOf}
      x={getX}
      y={getY}
      fields={FIELDS}
      ramp={SCORE}
      noun="biosample"
      filters={filters}
      columns={columns}
      controls={activeOnlyControl}
      controlledColumns={activeOnly === "on" ? CONTROLLED_COLUMNS : undefined}
      selected={selectedNames}
      onPointClicked={toggleSelection}
      onLassoSelect={(picked) =>
        setSelected((prev) => {
          const alreadySelected = new Set(prev.map(getRowId));
          return [...prev, ...picked.filter((row) => !alreadySelected.has(getRowId(row)))];
        })
      }
      tooltip={(row) => biosampleTooltip(row, assay)}
      radius={RADIUS}
      loading={loading_umap}
      downloadFileName={`${assay}_UMAP`}
      animationGroupSize={assay === "ctcf" ? 15 : assay === "dnase" ? 65 : 30}
      ref={ref}
    />
  );
};

export default AssayUMAP;
