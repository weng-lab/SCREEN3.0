import { TrackTooltip } from "@weng-lab/genomebrowser-tracks/shared";
import type { BulkBedRect } from "@weng-lab/genomebrowser-tracks/bulkbed";
import { humanChromStates, mouseChromStates } from "../constants";

export default function ChromHmmTooltip({
  rect,
  tissue,
  assembly,
}: {
  rect: BulkBedRect;
  tissue: string;
  assembly: "GRCh38" | "mm10";
}) {
  const name = rect.name ?? rect.fields[0] ?? "Unknown";
  const state = (assembly === "GRCh38" ? humanChromStates : mouseChromStates)[name];
  return (
    <TrackTooltip
      title={name}
      titleColor={state?.color}
      rows={[
        {
          label: "State",
          value: state ? `${state.description}${state.stateno ? ` (${state.stateno})` : ""}` : "Unknown state",
        },
        { label: "Biosample", value: tissue },
        { label: "Location", value: `${rect.chromosome}:${rect.start.toLocaleString()}-${rect.end.toLocaleString()}` },
      ]}
    />
  );
}
