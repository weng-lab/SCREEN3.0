import { gql } from "common/types/generated/gql";
import { useQuery } from "@apollo/client/react";
import { CLASS_COLORS } from "common/colors";
import { CLASS_DESCRIPTIONS } from "common/consts";

interface CCRETooltipProps {
  assembly: string;
  name: string;
}

const MAXZ_QUERY = gql(`
  query cCRE_2($assembly: String!, $accession: [String!]) {
    cCREQuery(assembly: $assembly, accession: $accession) {
      group
      dnase: maxZ(assay: "dnase")
      h3k4me3: maxZ(assay: "h3k4me3")
      h3k27ac: maxZ(assay: "h3k27ac")
      ctcf: maxZ(assay: "ctcf")
      atac: maxZ(assay: "atac")
    }
  }
`);

const MARKS: [string, "dnase" | "h3k4me3" | "h3k27ac" | "ctcf" | "atac"][] = [
  ["DNase", "dnase"],
  ["H3K4me3", "h3k4me3"],
  ["H3K27ac", "h3k27ac"],
  ["CTCF", "ctcf"],
  ["ATAC", "atac"],
];

export default function CCRETooltip({ assembly, name }: CCRETooltipProps) {
  const { data, loading, error } = useQuery(MAXZ_QUERY, {
    variables: { assembly, accession: name },
  });

  if (error) return null;

  const width = 400;
  const height = loading || !data?.cCREQuery?.[0] ? 40 : 210;
  const padding = 16;
  const lineHeight = 20;
  const startY = padding + 35;

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#ffffff" stroke="#000000" strokeWidth="2" rx="4" ry="4" />

      {loading || !data?.cCREQuery?.[0] ? (
        <g>
          <circle
            cx={width / 2}
            cy={height / 2}
            r="8"
            fill="none"
            stroke="#1976d2"
            strokeWidth="2"
            strokeDasharray="12.57"
            strokeDashoffset="0"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 50 50;360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ) : (
        <g>
          <rect
            x={padding}
            y={padding + 3}
            width={10}
            height={10}
            fill={CLASS_COLORS[data.cCREQuery[0].group] ?? "#8c8c8c"}
          />
          <text x={padding + 16} y={padding + 12} fontSize="24" fontFamily="Arial, sans-serif" fill="#000000">
            {name}
          </text>
          <text x={padding} y={startY} fontSize="21" fontFamily="Arial, sans-serif" fill="#000000">
            {CLASS_DESCRIPTIONS[data.cCREQuery[0].group]}
          </text>
          <text x={padding} y={startY + lineHeight} fontSize="19" fontFamily="Arial, sans-serif" fill="#666666">
            Click for details about this cCRE
          </text>
          <text
            x={padding}
            y={startY + lineHeight * 2.5}
            fontSize="19"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            fill="#000000"
          >
            Max Z-scores across all biosamples:
          </text>
          {MARKS.map(([label, key], i) => {
            const y = startY + lineHeight * (3.5 + i);
            const score = data.cCREQuery[0][key]?.toFixed(2);
            return (
              <g key={key}>
                <text x={padding} y={y} fontSize="19" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#000000">
                  {label}:
                </text>
                <text x={padding + 120} y={y} fontSize="19" fontFamily="Arial, sans-serif" fill="#000000">
                  {score}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
