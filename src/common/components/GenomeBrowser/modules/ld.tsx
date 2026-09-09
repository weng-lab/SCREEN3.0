import { createContext, use, useMemo, useState } from "react";
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
} from "@weng-lab/genomebrowser-tracks/shared";
import { z } from "zod";
import { isLead, type LDSnp } from "./ldData";
import { layoutLD } from "./ldLayout";

/**
 * The host owns the Apollo study query and supplies SNPs/loading/error for the track's studyId.
 * Keep data outside serializable track config; publish a new data array when study results change.
 * Context updates redraw the renderer without a second query or a global data store.
 */
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
  const pinned = new Set(config.show);
  const layout = useMemo(
    () =>
      layoutLD({
        snps: host.data,
        activeIds: hovered ? [...config.show, hovered] : config.show,
        region,
        width,
        height,
      }),
    [host.data, config.show, hovered, region, width, height]
  );
  if (host.loading || host.error)
    return (
      <text x={8} y={18} fill={theme.palette.text.secondary}>
        {host.error ? `Unable to load LD: ${host.error}` : "Loading LD…"}
      </text>
    );
  return (
    <g>
      {layout.arcs.map(({ key, path, strokeWidth }) => (
        <g key={key} pointerEvents="none">
          <path d={path} fill="none" stroke={color} opacity={0.5} strokeWidth={strokeWidth} />
        </g>
      ))}
      {layout.snps.map(({ snp, lead, ...bounds }) => (
        <rect
          key={snp.snpid}
          {...bounds}
          fill={lead ? color : lighten(color, 0.3)}
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
      {layout.labels.map(({ key, rSquared, labelX, baseline, background, leader }) => (
        <g key={key} pointerEvents="none">
          {leader && <line {...leader} stroke={color} strokeOpacity={0.4} />}
          <rect {...background} rx={2} fill="white" fillOpacity={0.8} />
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
  // The browser requires a fetch result to render; LDDataContext supplies the actual study data.
  // studyId still participates in fetch invalidation, while the host remains the only query owner.
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
