import { useMemo } from "react";
import { useInteraction, useTooltip, type TrackRendererProps } from "@weng-lab/genomebrowser";
import { createGenomicXScale, packRows, useRowLayout } from "@weng-lab/genomebrowser-tracks/shared";
import type { Config, Data, Peak, BedRow } from "./tfPeaks";
import { nameKey } from "./tfPeakName";
import motifData from "./green-motifs.json";

function scoreColor(score = 0) {
  const c = Math.round(227 * (1 - Math.min(1000, Math.max(0, score)) / 1000))
    .toString(16)
    .padStart(2, "0");
  return `#${c}${c}${c}`;
}

export default function TfRenderer({
  id,
  data,
  config,
  region,
  visibleRegion,
  width,
}: TrackRendererProps<Config, Data>) {
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
