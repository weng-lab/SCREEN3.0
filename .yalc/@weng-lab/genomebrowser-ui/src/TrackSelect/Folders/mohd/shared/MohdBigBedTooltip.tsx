import { InferBigBedRow } from "@weng-lab/genomebrowser";
import {
  mohdAtacFdrPeaksSchema,
  mohdAtacPseudorepPeaksSchema,
} from "./bigBedSchemas";

type MohdBigBedRow =
  | InferBigBedRow<typeof mohdAtacFdrPeaksSchema>
  | InferBigBedRow<typeof mohdAtacPseudorepPeaksSchema>;

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

function formatValue(value: string | number | undefined) {
  if (value === undefined) {
    return "-";
  }

  return `${value}`;
}

export function MohdBigBedTooltip(rect: MohdBigBedRow) {
  const rows = [
    {
      label: "Position",
      value: `${rect.chr}:${rect.start.toLocaleString()}-${rect.end.toLocaleString()}`,
    },
    { label: "Name", value: formatValue(rect.name) },
    { label: "Score", value: formatValue(rect.score) },
    { label: "Strand", value: formatValue(rect.strand) },
    { label: "Signal", value: formatValue(rect.signalValue) },
    { label: "pValue", value: formatValue(rect.pValue) },
    { label: "qValue", value: formatValue(rect.qValue) },
    { label: "Peak", value: formatValue(rect.peak) },
  ];
  const pad = 8;
  const lineH = 14;
  const titleH = 18;
  const width = 280;
  const height = pad + titleH + rows.length * lineH + pad;

  return (
    <g>
      <rect
        width={width}
        height={height}
        fill="white"
        rx={3}
        style={{ filter: "drop-shadow(0px 0px 5px rgba(0,0,0,0.3))" }}
      />
      <text x={pad} y={pad + 12} fontSize={12} fontWeight="bold" fill="#333">
        {rect.name || "MOHD peak"}
      </text>
      {rows.map((row, index) => (
        <TooltipRow
          key={row.label}
          label={row.label}
          value={row.value}
          y={pad + titleH + index * lineH}
        />
      ))}
    </g>
  );
}
