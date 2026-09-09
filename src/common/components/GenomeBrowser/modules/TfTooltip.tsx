import { TrackTooltip, type TrackTooltipRow } from "@weng-lab/genomebrowser-tracks/shared";
import { DNALogo } from "logo-test";
import type { Peak } from "./tfPeaks";
import { nameKey } from "./tfPeakName";

export default function TfTooltip({ item }: { item: Peak }) {
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
