import { useMemo, useState } from "react";
import { Stack, TextField } from "@mui/material";
import {
  defineTrackModule,
  fetchOnChange,
  useInteraction,
  useTooltip,
  type TrackRendererProps,
  type TrackSettingsProps,
} from "@weng-lab/genomebrowser";
import { bed3Schema, createBigBedFile } from "@weng-lab/genomic-reader";
import {
  TrackTooltip,
  TrackSettingsLayout,
  TrackSettingsSection,
  TrackSettingsFieldGrid,
  TrackSettingsUrlField,
  createGenomicXScale,
  packRows,
  useRowLayout,
  type TrackTooltipRow,
} from "@weng-lab/genomebrowser-tracks/shared";
import { DNALogo } from "logo-test";
import { z } from "zod";
import motifData from "./green-motifs.json";

export const PEAKS_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.rPeaks.bb";
export const MOTIFS_URL = "https://users.wenglab.org/gaomingshi/no_trim.TF_name.decorator.bb";
const schema = z.object({
  primaryUrl: fetchOnChange(z.string().min(1)),
  overlayUrl: fetchOnChange(z.string().min(1)),
  filter: z.array(z.string()).default([]),
  overlayColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .default("#36dd81"),
  rowHeight: z.number().min(1).default(12),
});
type Config = z.infer<typeof schema>;
type FileReader = ReturnType<typeof createBigBedFile<typeof bed3Schema>>;
type BedRow = Awaited<ReturnType<FileReader["read"]>>[number];
export type Peak = BedRow & { name: string; score?: number; cCREId?: string; biosamples: string[]; pwm?: number[][] };
type Data = { primary: Peak[]; overlay: BedRow[] };
const nameKey = (name?: string) => name?.split(/[-_]/)[0].trim().toUpperCase() ?? "";

export function parsePeak(row: BedRow): Peak {
  const f = row.fields;
  let biosamples: string[] = [];
  try {
    const support: unknown = JSON.parse(f[13] ?? "{}");
    if (support && typeof support === "object" && !Array.isArray(support)) biosamples = Object.keys(support).sort();
  } catch {
    /* Optional source annotation may be missing. */
  }
  const score = Number.parseFloat(f[1]);
  return { ...row, name: f[0] ?? "", score: Number.isFinite(score) ? score : undefined, cCREId: f[11], biosamples };
}
function scoreColor(score = 0) {
  const c = Math.round(227 * (1 - Math.min(1000, Math.max(0, score)) / 1000))
    .toString(16)
    .padStart(2, "0");
  return `#${c}${c}${c}`;
}

function TfSettings({ track, updateTrack }: TrackSettingsProps<Config, Peak>) {
  return (
    <TrackSettingsLayout>
      <TrackSettingsSection title="Data sources">
        <TrackSettingsFieldGrid>
          <TrackSettingsUrlField
            label="Peaks URL"
            value={track.config.primaryUrl}
            disabled={track.source === "host"}
            onCommit={(primaryUrl) => updateTrack({ config: { primaryUrl } })}
          />
          <TrackSettingsUrlField
            label="Motifs URL"
            value={track.config.overlayUrl}
            disabled={track.source === "host"}
            onCommit={(overlayUrl) => updateTrack({ config: { overlayUrl } })}
          />
        </TrackSettingsFieldGrid>
      </TrackSettingsSection>
      <TrackSettingsSection title="TF filters">
        <TfFilterFields filter={track.config.filter} updateTrack={updateTrack} />
      </TrackSettingsSection>
    </TrackSettingsLayout>
  );
}

function TfFilterFields({
  filter,
  updateTrack,
}: Pick<TrackSettingsProps<Config, Peak>, "updateTrack"> & { filter: string[] }) {
  const saved = JSON.stringify(filter);
  const [draft, setDraft] = useState(() => ({ saved, rows: [...filter, ""] }));
  const [error, setError] = useState<string>();
  if (draft.saved !== saved) setDraft({ saved, rows: [...filter, ""] });

  function commit() {
    const nextFilter = draft.rows.map((value) => value.trim().toUpperCase()).filter(Boolean);
    const result = updateTrack({ config: { filter: nextFilter } });
    if (result.ok) {
      setDraft({ saved: JSON.stringify(nextFilter), rows: draft.rows });
      setError(undefined);
    } else {
      setError("Unable to apply TF filters.");
    }
  }

  return (
    <Stack spacing={1}>
      {draft.rows.map((value, index) => (
        <TextField
          key={index}
          fullWidth
          size="small"
          label={`Filter TF ${index + 1}`}
          placeholder="e.g. CTCF"
          value={value}
          error={error !== undefined}
          helperText={index === draft.rows.length - 1 ? error : undefined}
          onChange={(event) => {
            const rows = [...draft.rows];
            rows[index] = event.target.value;
            if (rows.every((row) => row.trim() !== "")) rows.push("");
            setDraft({ ...draft, rows });
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
          }}
        />
      ))}
    </Stack>
  );
}

function TfTooltip({ item }: { item: Peak }) {
  const rows: TrackTooltipRow[] = [
    { label: "Score", value: item.score == null ? "—" : String(item.score) },
    { label: "Location", value: `${item.chromosome}:${item.start.toLocaleString()}-${item.end.toLocaleString()}` },
  ];
  const ccres = item.cCREId?.split(",").filter(Boolean) ?? [];
  if (ccres.length)
    rows.push({
      label: "cCREs",
      value: ccres.slice(0, 5).join(", ") + (ccres.length > 5 ? ` (+${ccres.length - 5} more)` : ""),
    });
  for (let i = 0; i < Math.min(item.biosamples.length, 12); i += 3)
    rows.push({ label: i === 0 ? "Biosamples" : "", value: item.biosamples.slice(i, i + 3).join(", ") });
  if (item.biosamples.length > 12) rows.push({ label: "", value: `+${item.biosamples.length - 12} more biosamples` });
  const logoY = 20 + rows.length * 17;
  // Reserve rows inside the same first-party tooltip surface for the existing motif logo.
  if (item.pwm?.length) rows.push(...Array.from({ length: 5 }, () => ({ label: "", value: "" })));
  return (
    <g>
      <TrackTooltip title={nameKey(item.name) || item.name} rows={rows} />
      {item.pwm?.length > 0 && (
        <g transform={`translate(0,${logoY})`}>
          <DNALogo ppm={item.pwm} mode="INFORMATION_CONTENT" width={240} height={75} />
        </g>
      )}
    </g>
  );
}

function TfRenderer({ id, data, config, region, visibleRegion, width }: TrackRendererProps<Config, Data>) {
  const x = createGenomicXScale(region, width);
  const interaction = useInteraction<Peak>();
  const tooltip = useTooltip<Peak, Config>();
  const filters = new Set(config.filter.map(nameKey));
  const selected = data.primary.filter((p) => !filters.size || filters.has(nameKey(p.name)));
  const visible = (p: Peak) =>
    p.chromosome === visibleRegion.chromosome && p.start < visibleRegion.end && p.end > visibleRegion.start;
  const rows = packRows(selected, (p) => ({ start: x(p.start), end: Math.max(x(p.start) + 1, x(p.end)) }));
  rows.sort((a, b) => Number(b.some(visible)) - Number(a.some(visible)));
  const { rowHeight, trackHeight } = useRowLayout(id, rows.filter((row) => row.some(visible)).length, config);
  const overlayByName = useMemo(() => {
    const index = new Map<string, BedRow[]>();
    for (const row of data.overlay) {
      const key = nameKey(row.fields[0]);
      const entries = index.get(key) ?? [];
      entries.push(row);
      index.set(key, entries);
    }
    return index;
  }, [data.overlay]);
  return (
    <g>
      <rect width={width} height={trackHeight} fill="transparent" />
      {rows.map((row, ri) => (
        <g key={ri} transform={`translate(0,${ri * rowHeight})`}>
          {row.map((peak, pi) => {
            const attached = (overlayByName.get(nameKey(peak.name)) ?? []).filter(
              (m) => m.start < peak.end && m.end > peak.start
            );
            const pwm = attached.length
              ? (motifData as Record<string, { trimmed_ppm: number[][] }>)[nameKey(peak.name)]?.trimmed_ppm
              : undefined;
            const item = { ...peak, pwm };
            return (
              <g
                key={`${peak.name}:${peak.start}:${pi}`}
                style={{ cursor: interaction?.onClick ? "pointer" : "default" }}
                onClick={() => interaction?.onClick?.(item)}
                onMouseEnter={(event) => {
                  interaction?.onHover?.(item);
                  tooltip.show(item, event);
                }}
                onMouseLeave={() => {
                  interaction?.onLeave?.(item);
                  tooltip.hide();
                }}
              >
                <rect
                  x={x(peak.start)}
                  y={rowHeight * 0.2}
                  width={Math.max(1, x(peak.end) - x(peak.start))}
                  height={rowHeight * 0.6}
                  fill={scoreColor(peak.score)}
                />
                {attached.map((motif, mi) => (
                  <rect
                    key={mi}
                    x={x(Math.max(peak.start, motif.start))}
                    y={rowHeight * 0.2}
                    width={Math.max(1, x(Math.min(peak.end, motif.end)) - x(Math.max(peak.start, motif.start)))}
                    height={rowHeight * 0.6}
                    fill={config.overlayColor}
                  />
                ))}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

export const tfPeaksModule = defineTrackModule<Peak>()({
  type: "screen-tf-peaks",
  defaults: { height: 80, color: "#555555" },
  configSchema: schema,
  async fetch({ track: { config }, demand: { region }, resources }): Promise<Data> {
    const read = async (url: string) => {
      let file = resources.get<FileReader>(url);
      if (!file) {
        file = createBigBedFile({ url, schema: bed3Schema });
        resources.set(url, file);
      }
      return file.read(region);
    };
    const [primary, overlay] = await Promise.all([read(config.primaryUrl), read(config.overlayUrl)]);
    return { primary: primary.map(parsePeak), overlay };
  },
  render: { full: TfRenderer },
  settingsComponent: TfSettings,
  tooltipComponent: TfTooltip,
});
