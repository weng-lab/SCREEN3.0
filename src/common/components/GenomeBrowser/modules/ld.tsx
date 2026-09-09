import { createContext, use, useState } from "react";
import { useTheme, lighten } from "@mui/material/styles";
import {
  defineTrackModule,
  fetchOnChange,
  useInteraction,
  useTooltip,
  useTrackStore,
  type TrackRendererProps,
  type TrackSettingsProps,
} from "@weng-lab/genomebrowser";
import {
  TrackTooltip,
  TrackSettingsLayout,
  TrackSettingsSection,
  TrackSettingsFieldGrid,
  TrackSettingsTextField,
  createGenomicXScale,
} from "@weng-lab/genomebrowser-tracks/shared";
import { z } from "zod";
import { ldConnections, isLead, type LDSnp } from "./ldData";

// Host data stays outside serializable track config. Context updates redraw the renderer without
// duplicating SCREEN's existing Apollo study query or coupling a module to a global data store.
export const LDDataContext = createContext<{ data: readonly LDSnp[]; loading: boolean; error?: string }>({
  data: [],
  loading: false,
});
const schema = z.object({ studyId: fetchOnChange(z.string().min(1)), show: z.array(z.string()).default([]) });
type Config = z.infer<typeof schema>;

function LDSettings({ track, updateTrack }: TrackSettingsProps<Config, LDSnp>) {
  return (
    <TrackSettingsLayout>
      <TrackSettingsSection title="Linkage disequilibrium">
        <TrackSettingsFieldGrid>
          <TrackSettingsTextField
            label="Pinned SNPs"
            value={track.config.show.join(", ")}
            placeholder="rs123, rs456"
            validate={() => undefined}
            onCommit={(value) =>
              updateTrack({
                config: {
                  show: value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
          />
        </TrackSettingsFieldGrid>
      </TrackSettingsSection>
    </TrackSettingsLayout>
  );
}

function FullLD({ id, config, region, width, height, color }: TrackRendererProps<Config, boolean>) {
  const host = use(LDDataContext);
  const theme = useTheme();
  const [hovered, setHovered] = useState<string>();
  const updateTrack = useTrackStore((s) => s.updateTrack);
  const interaction = useInteraction<LDSnp>();
  const tooltip = useTooltip<LDSnp, Config>();
  const x = createGenomicXScale(region, width);
  const snps = host.data.filter(
    (s) => s.chromosome === region.chromosome && s.stop > region.start && s.start < region.end
  );
  const pinned = new Set(config.show);
  const connections = ldConnections(snps, hovered ? [...config.show, hovered] : config.show);
  const y = (s: LDSnp) => height * (isLead(s) ? 1 / 3 : 2 / 3);
  const labelGap = 4;
  const labelHeight = 14;
  const labels = connections.flatMap(({ source, target, rSquared }) => {
    if (rSquared == null) return [];
    const midpointX = (x((source.start + source.stop) / 2) + x((target.start + target.stop) / 2)) / 2;
    const controlY = Math.min(y(source), y(target)) - height / 6;
    // Evaluate the quadratic curve at t = 0.5 to keep the score beside its arc.
    const labelY = (y(source) + 2 * controlY + y(target)) / 4 - 3;
    return [
      { key: `${source.snpid}:${target.snpid}`, rSquared, midpointX, labelY, width: String(rSquared).length * 6 + 6 },
    ];
  });
  const placedLabels: ((typeof labels)[number] & { labelX: number; baseline: number })[] = [];
  for (const label of labels.sort((a, b) => a.midpointX - b.midpointX)) {
    // Try nearby positions first, then another row if the midpoint is crowded.
    const baseline = Math.max(10, Math.min(height - 4, label.labelY));
    const candidates = [];
    for (let row = 0; row * (labelHeight + labelGap) <= height; row++) {
      for (const direction of row === 0 ? [1] : [-1, 1]) {
        const candidateY = baseline + direction * row * (labelHeight + labelGap);
        if (candidateY < 10 || candidateY + 4 > height) continue;
        const candidateXs = [
          Math.max(label.width / 2, Math.min(width - label.width / 2, label.midpointX)),
          ...placedLabels.flatMap((placed) => [
            placed.labelX + (placed.width + label.width) / 2 + labelGap,
            placed.labelX - (placed.width + label.width) / 2 - labelGap,
          ]),
        ];
        for (const candidateX of candidateXs) {
          if (candidateX - label.width / 2 < 0 || candidateX + label.width / 2 > width) continue;
          if (
            placedLabels.some(
              (placed) =>
                Math.abs(candidateX - placed.labelX) < (label.width + placed.width) / 2 + labelGap &&
                Math.abs(candidateY - placed.baseline) < labelHeight + labelGap
            )
          )
            continue;
          candidates.push({ labelX: candidateX, baseline: candidateY });
        }
      }
    }
    candidates.sort(
      (a, b) =>
        Math.hypot(a.labelX - label.midpointX, a.baseline - baseline) -
        Math.hypot(b.labelX - label.midpointX, b.baseline - baseline)
    );
    // If the track is completely full, the SNP tooltip still provides its score.
    if (candidates[0]) placedLabels.push({ ...label, ...candidates[0] });
  }
  if (host.loading || host.error)
    return (
      <text x={8} y={18} fill={theme.palette.text.secondary}>
        {host.error ? `Unable to load LD: ${host.error}` : "Loading LD…"}
      </text>
    );
  return (
    <g>
      {connections.map(({ source, target, rSquared }) => {
        const a = x((source.start + source.stop) / 2),
          b = x((target.start + target.stop) / 2);
        const sourceY = y(source);
        const targetY = y(target);
        const midpointX = (a + b) / 2;
        const controlY = Math.min(sourceY, targetY) - height / 6;
        return (
          <g key={`${source.snpid}:${target.snpid}`} pointerEvents="none">
            <path
              d={`M ${a} ${sourceY} Q ${midpointX} ${controlY} ${b} ${targetY}`}
              fill="none"
              stroke={color}
              opacity={0.5}
              strokeWidth={rSquared == null ? 4 : 1 + 7 * Math.max(0, Math.min(1, (rSquared - 0.7) / 0.3))}
            />
          </g>
        );
      })}
      {snps.map((snp) => (
        <rect
          key={snp.snpid}
          x={x(snp.start) - 2}
          y={y(snp)}
          width={Math.max(4, x(snp.stop) - x(snp.start) + 4)}
          height={height - y(snp)}
          fill={isLead(snp) ? color : lighten(color, 0.3)}
          stroke={pinned.has(snp.snpid) ? theme.palette.text.primary : "none"}
          style={{ cursor: "pointer" }}
          onClick={() => {
            updateTrack(id, {
              config: {
                show: pinned.has(snp.snpid) ? config.show.filter((s) => s !== snp.snpid) : [...config.show, snp.snpid],
              },
            });
            interaction?.onClick?.(snp);
          }}
          onMouseEnter={(event) => {
            setHovered(snp.snpid);
            interaction?.onHover?.(snp);
            tooltip.show(snp, event);
          }}
          onMouseLeave={() => {
            setHovered(undefined);
            interaction?.onLeave?.(snp);
            tooltip.hide();
          }}
        />
      ))}
      {/* Paint scores last so every background sits above the connecting arcs. */}
      {placedLabels.map(({ key, rSquared, midpointX, labelY, labelX, baseline, width: labelWidth }) => (
        <g key={key} pointerEvents="none">
          {(Math.abs(labelX - midpointX) > labelGap || Math.abs(baseline - labelY) > labelGap) && (
            <line x1={midpointX} y1={labelY + 3} x2={labelX} y2={baseline - 3} stroke={color} strokeOpacity={0.4} />
          )}
          <rect
            x={labelX - labelWidth / 2}
            y={baseline - 10}
            width={labelWidth}
            height={14}
            rx={2}
            fill="white"
            fillOpacity={0.8}
          />
          <text x={labelX} y={baseline} textAnchor="middle" fontSize={10} fill="#111" fontFamily="monospace">
            {rSquared}
          </text>
        </g>
      ))}
    </g>
  );
}

export const ldModule = defineTrackModule<LDSnp>()({
  type: "screen-ld",
  defaults: { height: 60, color: "#ff0000" },
  configSchema: schema,
  fetch: async () => true,
  render: { full: FullLD },
  settingsComponent: LDSettings,
  tooltipComponent: ({ item }) => (
    <TrackTooltip
      title={item.snpid}
      rows={[
        { label: "Location", value: `${item.chromosome}:${item.start.toLocaleString()}-${item.stop.toLocaleString()}` },
        { label: isLead(item) ? "Role" : "r²", value: isLead(item) ? "Lead variant" : item.rsquare },
        { label: "LD block", value: item.ldblock == null ? "—" : String(item.ldblock) },
        { label: "Selection", value: "Click to pin or unpin relationships" },
      ]}
    />
  ),
});
