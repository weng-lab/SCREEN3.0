import {
  ClipPath,
  CustomTrackConfig,
  CustomTrackProps,
  DisplayMode,
  fetchBigBedUrl,
  Rect,
  renderSquishBigBedData,
  TrackType,
  useBrowserStore,
  useInteraction,
  useRowHeight,
  useXTransform,
  Vibrant,
  useTrackStore,
} from "@weng-lab/genomebrowser";
import { DNALogo } from "logo-test";
import { useMemo, useState } from "react";
import motifData from "./green-motifs.json";

// --- TF Peak BigBed Parser ---

interface TfPeakBigBedData {
  chr: string;
  start: number;
  end: number;
  name?: string;
  score?: number;
  color?: string;
  tfName?: string;
  expRatio?: string;
  cCREId?: string;
  experimentId?: string;
  expSupport?: Record<string, Record<string, string>>;
}

function parseTfPeakBigBed(
  chrom: string,
  startBase: number,
  endBase: number,
  rest: string,
): TfPeakBigBedData {
  const entry: TfPeakBigBedData = {
    chr: chrom,
    start: startBase,
    end: endBase,
  };
  const tokens = rest.split("\t");
  if (tokens.length > 0) entry.name = tokens[0];
  if (tokens.length > 1) entry.score = parseFloat(tokens[1]);
  // tokens[2] = strand, tokens[3] = thickStart, tokens[4] = thickEnd
  if (tokens.length > 5 && tokens[5] !== "." && tokens[5] !== "0") {
    entry.color = tokens[5].includes(",")
      ? tokens[5].startsWith("rgb")
        ? tokens[5]
        : "rgb(" + tokens[5] + ")"
      : tokens[5];
  }
  // tokens[6] = blockCount, tokens[7] = blockSizes, tokens[8] = blockStarts
  if (tokens.length > 9) entry.tfName = tokens[9];
  if (tokens.length > 10) entry.expRatio = tokens[10];
  if (tokens.length > 11) entry.cCREId = tokens[11];
  if (tokens.length > 12) entry.experimentId = tokens[12];
  if (tokens.length > 13) {
    try {
      entry.expSupport = JSON.parse(tokens[13]);
    } catch {
      // leave undefined if JSON is malformed
    }
  }
  return entry;
}

// --- Types ---

type OverlayData = {
  primary: TfPeakBigBedData[];
  overlay: Rect[];
};

type OverlayInteractionRect = Rect & {
  chr?: string;
  pwm?: number[][];
  tfName?: string;
  expRatio?: string;
  cCREId?: string;
  experimentId?: string;
  expSupport?: Record<string, Record<string, string>>;
};

// The config type — extra fields go directly on the config
type OverlayBigBedConfig = CustomTrackConfig<OverlayInteractionRect> & {
  primaryUrl: string;
  overlayUrl: string;
  baseColor?: string;
  overlayColor?: string;
  filter?: string[];
};

// --- Helpers ---

function nameKey(name?: string) {
  if (!name) return "";
  return name.split(/[-_]/)[0].trim().toLowerCase();
}

function buildOverlayIndex(rects: Rect[]) {
  return rects.reduce<Record<string, Rect[]>>((acc, rect) => {
    const key = nameKey(rect.name);
    if (!key) return acc;
    (acc[key] ??= []).push(rect);
    return acc;
  }, {});
}

function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart <= bEnd && bStart <= aEnd;
}

function scoreColor(score?: number) {
  const t = Math.min(Math.max(score ?? 0, 0), 1000) / 1000;
  const r = Math.round(0xe3 + (0x00 - 0xe3) * t);
  const g = Math.round(0xe3 + (0x00 - 0xe3) * t);
  const b = Math.round(0xe3 + (0x00 - 0xe3) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// --- Motif data lookup ---

type MotifEntry = { trimmed_ppm: number[][] };
const motifLookup = motifData as Record<string, MotifEntry>;

function lookupPwm(name?: string): number[][] | undefined {
  const key = nameKey(name)?.toUpperCase();
  if (!key) return undefined;
  const entry = motifLookup[key];
  return entry?.trimmed_ppm;
}

// --- Tooltip ---

function tfDisplayName(name?: string): string {
  return nameKey(name)?.toUpperCase() || name || "Unknown";
}

function TooltipRow({
  label,
  value,
  y,
}: {
  label: string;
  value: string;
  y: number;
}) {
  return (
    <g transform={`translate(0, ${y})`}>
      <text x={8} y={0} fontSize={10} fill="#888" dominantBaseline="hanging">
        {label}
      </text>
      <text x={100} y={0} fontSize={10} fill="#333" dominantBaseline="hanging">
        {value}
      </text>
    </g>
  );
}

function TfPeaksTooltip(rect: OverlayInteractionRect) {
  const pwm = rect.pwm;
  const label = tfDisplayName(rect.name);
  const totalWidth = 340;
  const pad = 8;
  const lineH = 14;
  const titleH = 18;

  // Build metadata rows (single-value rows)
  const metaRows: { label: string; value: string }[] = [];
  if (rect.score != null)
    metaRows.push({ label: "Score", value: `${rect.score}` });
  metaRows.push({
    label: "Position",
    value: `${rect.chr ? rect.chr + ":" : ""}${rect.start.toLocaleString()}-${rect.end.toLocaleString()}`,
  });

  // Multi-value rows: split comma-separated cCREs, group 4 per row, cap at 5
  const allCCREItems = rect.cCREId
    ? rect.cCREId
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const maxCCREs = 5;
  const cCREItems = allCCREItems.slice(0, maxCCREs);
  const hiddenCCREs = Math.max(0, allCCREItems.length - maxCCREs);
  const cCRERows: string[][] = [];
  for (let i = 0; i < cCREItems.length; i += 4) {
    cCRERows.push(cCREItems.slice(i, i + 4));
  }

  // Extract unique sorted biosamples from expSupport
  const allBiosamples: string[] = [];
  if (rect.expSupport) {
    const seen = new Set<string>();
    for (const cellLine of Object.keys(rect.expSupport)) {
      if (!seen.has(cellLine)) {
        seen.add(cellLine);
        allBiosamples.push(cellLine);
      }
    }
    allBiosamples.sort((a, b) => a.localeCompare(b));
  }
  const maxBiosamples = 12;
  const biosampleItems = allBiosamples.slice(0, maxBiosamples);
  const hiddenBiosamples = Math.max(0, allBiosamples.length - maxBiosamples);
  const biosampleText = biosampleItems.join(", ");
  const biosampleMoreText =
    hiddenBiosamples > 0 ? ` ...and ${hiddenBiosamples} more` : "";
  const biosampleCharsPerLine = Math.floor((totalWidth - 2 * pad) / 5.2);
  const biosampleContentLines = Math.max(
    1,
    Math.ceil(
      (biosampleText.length + biosampleMoreText.length) / biosampleCharsPerLine,
    ),
  );

  // Layout: compute y offsets upfront
  const hasLogo = pwm && pwm.length > 0;

  const logoHeight = hasLogo ? 80 : 0;
  const logoSectionH = hasLogo ? logoHeight + 4 : 0;
  const metaSectionH = metaRows.length * lineH;

  // cCRE section: label row + one row per group of 4 + optional "+N more" row
  const cCREGap = cCRERows.length > 0 ? 8 : 0;
  const cCREHeaderH = cCRERows.length > 0 ? lineH : 0;
  const cCREMoreH = hiddenCCREs > 0 ? lineH : 0;
  const cCRESectionH = cCRERows.length * lineH + cCREMoreH;

  // Biosamples section
  const biosampleGap = biosampleContentLines > 0 ? 8 : 0;
  const biosampleHeaderH = biosampleContentLines > 0 ? lineH : 0;
  const biosampleSectionH = biosampleContentLines * lineH;

  const titleY = pad;
  const logoY = titleY + titleH;
  const metaY = logoY + logoSectionH;
  const cCREY = metaY + metaSectionH + cCREGap;
  const cCREDataY = cCREY + cCREHeaderH;
  const biosampleY = cCREDataY + cCRESectionH + biosampleGap;
  const biosampleDataY = biosampleY + biosampleHeaderH;
  const totalHeight = biosampleDataY + biosampleSectionH + pad;

  return (
    <g>
      <rect
        width={totalWidth}
        height={totalHeight}
        fill="white"
        rx={3}
        style={{ filter: "drop-shadow(0px 0px 5px rgba(0,0,0,0.3))" }}
      />

      {/* Title */}
      <text x={pad} y={titleY + 12} fontSize={12} fontWeight="bold" fill="#333">
        {label}
      </text>

      {/* Logo */}
      {hasLogo && (
        <g transform={`translate(${pad}, ${logoY})`}>
          <DNALogo
            ppm={pwm!}
            mode="INFORMATION_CONTENT"
            width={totalWidth - 2 * pad}
            height={logoHeight}
          />
        </g>
      )}

      {/* Metadata rows */}
      {metaRows.map((row, i) => (
        <TooltipRow
          key={row.label}
          label={row.label}
          value={row.value}
          y={metaY + i * lineH}
        />
      ))}

      {/* Overlapping cCREs */}
      {cCRERows.length > 0 && (
        <g>
          <line
            x1={pad}
            x2={totalWidth - pad}
            y1={cCREY - 4}
            y2={cCREY - 4}
            stroke="#ddd"
          />
          <text
            x={pad}
            y={cCREY + 2}
            fontSize={9}
            fontWeight="bold"
            fill="#666"
            dominantBaseline="hanging"
          >
            Overlapping cCREs
          </text>
          {cCRERows.map((group, i) => (
            <text
              key={i}
              x={pad}
              y={cCREDataY + i * lineH + 2}
              fontSize={9}
              fill="#333"
              dominantBaseline="hanging"
            >
              {group.join(", ")}
            </text>
          ))}
          {hiddenCCREs > 0 && (
            <text
              x={pad}
              y={cCREDataY + cCRERows.length * lineH + 2}
              fontSize={9}
              fill="#aaa"
              dominantBaseline="hanging"
            >
              +{hiddenCCREs} more...
            </text>
          )}
        </g>
      )}

      {/* Biosamples */}
      {biosampleContentLines > 0 && (
        <g>
          <line
            x1={pad}
            x2={totalWidth - pad}
            y1={biosampleY - 4}
            y2={biosampleY - 4}
            stroke="#ddd"
          />
          <text
            x={pad}
            y={biosampleY + 2}
            fontSize={9}
            fontWeight="bold"
            fill="#666"
            dominantBaseline="hanging"
          >
            Biosamples
          </text>
          <foreignObject
            x={pad}
            y={biosampleDataY}
            width={totalWidth - 2 * pad}
            height={biosampleSectionH}
          >
            <div
              style={{
                color: "#333",
                fontSize: "9px",
                lineHeight: `${lineH}px`,
                margin: 0,
                padding: 0,
                overflow: "hidden",
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {biosampleText}
              {hiddenBiosamples > 0 && (
                <span style={{ color: "#aaa" }}>{biosampleMoreText}</span>
              )}
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );
}

// --- Settings Panel ---

function TfPeaksSettings({ id }: { id: string }) {
  const track = useTrackStore((state) => state.getTrack(id)) as
    | OverlayBigBedConfig
    | undefined;
  const editTrack = useTrackStore((state) => state.editTrack);
  const [input, setInput] = useState((track?.filter || []).join(", "));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    const names = value
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    editTrack<OverlayBigBedConfig>(id, {
      filter: names.length > 0 ? names : undefined,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingBlock: "5px",
        paddingInline: "10px",
        gap: "3px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>Filter TFs</div>
      <input
        value={input}
        onChange={handleChange}
        placeholder="e.g. CTCF, TP53, GATA1"
        style={{ width: "100%" }}
      />
    </div>
  );
}

// --- Renderer ---

function OverlayBigBedRenderer(
  props: CustomTrackProps<OverlayData> & OverlayBigBedConfig,
) {
  const {
    data,
    dimensions,
    id,
    height: trackHeight,
    color: _color,
    baseColor: _baseColorProp,
    overlayColor: overlayColorProp,
    filter,
    ...rest
  } = props;
  const domain = useBrowserStore((state) => state.domain);
  const { totalWidth, sideWidth } = dimensions;
  const { x, reverseX } = useXTransform(totalWidth);

  const filterSet = useMemo(
    () =>
      filter && filter.length > 0
        ? new Set(filter.map((f) => f.toUpperCase()))
        : null,
    [filter],
  );

  const visiblePrimary = useMemo(() => {
    let visible = (data?.primary || []).filter(
      (r) => r.end >= domain.start && r.start <= domain.end,
    );
    if (filterSet) {
      visible = visible.filter((r) =>
        filterSet.has(nameKey(r.name)?.toUpperCase()),
      );
    }
    return visible;
  }, [data, domain.end, domain.start, filterSet]);

  const rows = useMemo(
    () => renderSquishBigBedData(visiblePrimary, x),
    [visiblePrimary, x],
  );

  // Index primary data by "name:start:end" for fast TF metadata lookup
  const primaryIndex = useMemo(() => {
    const index = new Map<string, TfPeakBigBedData>();
    for (const item of visiblePrimary) {
      index.set(`${item.name}:${item.start}:${item.end}`, item);
    }
    return index;
  }, [visiblePrimary]);

  const rowHeight = useRowHeight(rows.length, id);
  const height = Math.max(trackHeight, rowHeight * Math.max(rows.length, 1));
  const overlayByName = useMemo(
    () => buildOverlayIndex(data?.overlay || []),
    [data],
  );

  const overlayColor = overlayColorProp || Vibrant[3];
  const cursor = rest.onClick ? "pointer" : "default";

  const { handleClick, handleHover, handleLeave } =
    useInteraction<OverlayInteractionRect>({
      onClick: rest.onClick,
      onHover: rest.onHover,
      onLeave: rest.onLeave,
      tooltip: rest.tooltip,
    });

  return (
    <g
      width={totalWidth}
      height={height}
      clipPath={`url(#${id})`}
      transform={`translate(-${sideWidth}, 0)`}
    >
      <rect width={totalWidth} height={height} fill="transparent" />
      <defs>
        <ClipPath id={id} width={totalWidth} height={height} />
      </defs>
      {rows.map((row, rowIndex) => {
        const baseY = rowHeight * 0.2;
        const baseH = rowHeight * 0.6;
        return (
          <g
            key={`row_${rowIndex}`}
            transform={`translate(0, ${rowIndex * rowHeight})`}
          >
            {row.map((rect, ri) => {
              const realStart = Math.round(reverseX(rect.start));
              const realEnd = Math.round(reverseX(rect.end));
              const baseName = rect.rectname;
              const attached = (
                overlayByName[nameKey(rect.rectname)] || []
              ).filter((a) =>
                intervalsOverlap(realStart, realEnd, a.start, a.end),
              );
              const fill = scoreColor(rect.score);
              const meta = primaryIndex.get(
                `${baseName}:${realStart}:${realEnd}`,
              );
              const baseRect: OverlayInteractionRect = {
                start: realStart,
                end: realEnd,
                name: baseName,
                color: fill,
                score: rect.score,
                chr: meta?.chr,
                pwm: attached.length > 0 ? lookupPwm(baseName) : undefined,
                tfName: meta?.tfName,
                expRatio: meta?.expRatio,
                cCREId: meta?.cCREId,
                experimentId: meta?.experimentId,
                expSupport: meta?.expSupport,
              };

              return (
                <g key={`${id}_${rowIndex}_${ri}`}>
                  <rect
                    style={{ cursor }}
                    x={rect.start}
                    y={baseY}
                    width={Math.max(rect.end - rect.start, 1)}
                    height={baseH}
                    fill={fill}
                    opacity={0.9}
                    onClick={() => handleClick(baseRect)}
                    onMouseOver={(e) =>
                      handleHover(baseRect, baseRect.name || "", e)
                    }
                    onMouseOut={() => handleLeave(baseRect)}
                  />
                  {attached.map((a, ai) => {
                    const left = x(a.start);
                    const right = x(a.end);
                    return (
                      <rect
                        style={{ cursor }}
                        key={`${id}_${rowIndex}_${ri}_a_${ai}`}
                        x={left}
                        y={baseY}
                        width={Math.max(right - left, 1)}
                        height={baseH}
                        fill={a.color || overlayColor}
                        opacity={0.9}
                        onClick={() => handleClick(baseRect)}
                        onMouseOver={(e) =>
                          handleHover(baseRect, baseRect.name || "", e)
                        }
                        onMouseOut={() => handleLeave(baseRect)}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// --- Track config ---

export const PEAKS_BIGBED_URL =
  "https://users.wenglab.org/gaomingshi/no_trim.TF_name.rPeaks.bb";
export const DECORATOR_BIGBED_URL =
  "https://users.wenglab.org/gaomingshi/no_trim.TF_name.decorator.bb";

export const tfPeaksTrack: OverlayBigBedConfig = {
  id: "custom-tf-peaks",
  title: "TF Peaks (Overlay)",
  shortLabel: "TF Peaks",
  trackType: TrackType.Custom,
  displayMode: DisplayMode.Full,
  color: Vibrant[0],
  height: 80,
  primaryUrl: PEAKS_BIGBED_URL,
  overlayUrl: DECORATOR_BIGBED_URL,
  baseColor: "#d1d5db",
  overlayColor: "#36dd81",
  onClick: (rect) => {
    console.log("Clicked on rect:", rect);
  },
  tooltip: TfPeaksTooltip,
  settingsPanel: TfPeaksSettings,
  renderers: {
    [DisplayMode.Full]: OverlayBigBedRenderer,
  },
  fetcher: async (ctx) => {
    const track = ctx.track as OverlayBigBedConfig;
    const [primary, overlay] = await Promise.all([
      fetchBigBedUrl(track.primaryUrl, ctx, parseTfPeakBigBed),
      fetchBigBedUrl(track.overlayUrl, ctx),
    ]);
    const error =
      [primary.error, overlay.error].filter(Boolean).join("\n") || null;
    return {
      data: { primary: primary.data || [], overlay: overlay.data || [] },
      error,
    };
  },
};
