import { TrackTooltip, type TrackTooltipRow } from "@weng-lab/genomebrowser-tracks/shared";
import { CLASS_COLORS, CLASS_DESCRIPTIONS } from "common/ccre";
import { useCcreZScores } from "common/hooks/data/ccre";
import type { Assembly } from "common/types/globalTypes";

export type CcreTooltipBiosample = { name: string; displayname: string };

export default function CCRETooltip({
  assembly,
  name,
  biosample,
  classification,
  color,
}: {
  assembly: Assembly;
  name: string;
  biosample?: CcreTooltipBiosample;
  classification?: string;
  color?: string;
}) {
  const { data, loading, error } = useCcreZScores({ accessions: [name], assembly, biosample: biosample?.name });
  const ccre = data?.[name];
  const rows: TrackTooltipRow[] = [];
  if (loading) rows.push({ label: "Z-scores", value: "Loading…" });
  else if (error) rows.push({ label: "Z-scores", value: "Unable to load" });
  else if (!ccre) rows.push({ label: "Z-scores", value: "No data available" });
  const group = ccre?.group ?? classification;
  if (group) rows.push({ label: "Classification", value: CLASS_DESCRIPTIONS[group] ?? group });
  if (biosample) rows.push({ label: "Biosample", value: biosample.displayname });
  else rows.push({ label: "Scores", value: "Maximum across biosamples" });
  for (const [key, label] of [
    ["dnase", "DNase"],
    ["h3k4me3", "H3K4me3"],
    ["h3k27ac", "H3K27ac"],
    ["ctcf", "CTCF"],
    ["atac", "ATAC"],
  ] as const) {
    if (ccre?.[key] != null) rows.push({ label, value: ccre[key].toFixed(2) });
  }
  rows.push({ label: "Details", value: "Click to view this cCRE" });
  return <TrackTooltip title={name} titleColor={group ? (CLASS_COLORS[group] ?? color) : color} rows={rows} />;
}
