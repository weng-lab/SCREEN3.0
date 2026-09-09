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
        return (
          <g key={`${source.snpid}:${target.snpid}`} pointerEvents="none">
            <path
              d={`M ${a} ${y(source)} Q ${(a + b) / 2} ${-height / 3} ${b} ${y(target)}`}
              fill="none"
              stroke={color}
              opacity={0.5}
              strokeWidth={rSquared == null ? 4 : 1 + 7 * Math.max(0, Math.min(1, (rSquared - 0.7) / 0.3))}
            />
            {rSquared != null && (
              <text x={b} y={y(target) - 3} textAnchor="middle" fontSize={10} fill={theme.palette.text.primary}>
                {rSquared}
              </text>
            )}
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
