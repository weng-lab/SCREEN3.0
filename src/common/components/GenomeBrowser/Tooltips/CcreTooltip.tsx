import { gql, useQuery } from "@apollo/client";
import { CLASS_COLORS } from "common/colors";
import { CLASS_DESCRIPTIONS } from "common/consts";
import { CcreTooltipBiosample } from "../TrackSelect/defaultTracks";
import React, { useMemo } from "react";

interface CCRETooltipProps {
  assembly: string;
  name: string;
  biosample?: CcreTooltipBiosample;
}

const BIOSAMPLE_QUERY = gql(`
  query cCREBiosampleTooltip($assembly: String!, $biosampleName: [String!], $accession: [String!]) {
    ccREBiosampleQuery(assembly: $assembly, name: $biosampleName) {
      biosamples {
        name
        displayname
        cCREZScores(accession: $accession) {
          assay
          score
          experiment_accession
        }
      }
    }
  }
`);

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

const MARKS = ["DNase", "H3K4me3", "H3K27ac", "CTCF", "ATAC"];
const ASSAY_ORDER = ["dnase", "h3k4me3", "h3k27ac", "ctcf", "atac"];

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export default function CCRETooltip({ assembly, name, biosample }: CCRETooltipProps) {
  const {
    data: ccreData,
    loading: ccreLoading,
    error: ccreError,
  } = useQuery(MAXZ_QUERY, {
    variables: {
      assembly,
      accession: [name],
    },
  });
  const {
    data: biosampleData,
    loading: biosampleLoading,
    error: biosampleError,
  } = useQuery(BIOSAMPLE_QUERY, {
    variables: {
      assembly: assembly.toLowerCase(),
      accession: [name],
      biosampleName: biosample?.name ? [biosample.name] : undefined,
    },
    skip: !biosample,
  });

  if (ccreError || biosampleError) {
    return null;
  }

  const loading = ccreLoading || (biosample ? biosampleLoading : false);
  const biosampleScores = useMemo(() => {
    if (!biosample) return [];

    const zScores = biosampleData?.ccREBiosampleQuery?.biosamples?.[0]?.cCREZScores ?? [];

    return ASSAY_ORDER.flatMap((assay, index) => {
      const score = zScores.find((entry) => entry?.assay?.toLowerCase() === assay)?.score;
      return score == null ? [] : [{ label: MARKS[index], score: score.toFixed(2) }];
    });
  }, [biosample, biosampleData]);
  const maxZSscores = useMemo(() => {
    if (biosample || !ccreData?.cCREQuery?.[0]) return [];

    return ASSAY_ORDER.flatMap((assay, index) => {
      const score = ccreData.cCREQuery[0][assay];
      return score == null ? [] : [{ label: MARKS[index], score: score.toFixed(2) }];
    });
  }, [biosample, ccreData]);
  const scoreRows = biosample ? biosampleScores : maxZSscores;
  const biosampleDisplayName = biosampleData?.ccREBiosampleQuery?.biosamples?.[0]?.displayname ?? biosample?.displayname;
  const hasData = !!ccreData?.cCREQuery?.[0] && (!biosample || !!biosampleData?.ccREBiosampleQuery?.biosamples?.[0]);
  const width = 236;
  const padding = 10;
  const compactLineHeight = 16;
  const titleY = 22;
  const groupY = 40;
  const hintY = 56;
  const sectionLabelY = 74;
  const biosampleY = 90;
  const scoresStartY = biosample ? 108 : 90;
  const height = loading || !hasData ? 44 : scoresStartY + scoreRows.length * compactLineHeight + 2;
  const truncatedBiosampleName = biosampleDisplayName ? truncate(biosampleDisplayName, 34) : undefined;

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="white" rx="4" ry="4" style={{ filter: `drop-shadow(0 0 2px #000000)` }} />

      {loading || !hasData ? (
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
          <rect x={padding} y={10} width={10} height={10} fill={CLASS_COLORS[ccreData?.cCREQuery?.[0]?.group] ?? "#8c8c8c"} />
          <text x={padding + 16} y={titleY} fontSize={12} fontWeight="bold" fill="#000000">
            {name}
          </text>
          <text x={padding} y={groupY} fontSize={12} fill="#000000">
            {CLASS_DESCRIPTIONS[ccreData?.cCREQuery?.[0]?.group]}
          </text>
          <text x={padding} y={hintY} fontSize={12} fill="#666666">
            Click for details about this cCRE
          </text>
          <text x={padding} y={sectionLabelY} fontSize={12} fontWeight="bold" fill="#000000">
            {biosample ? "Biosample z-scores" : "Max z-scores across biosamples"}
          </text>
          {biosample && truncatedBiosampleName && (
            <text x={padding} y={biosampleY} fontSize={12} fill="#000000">
              {truncatedBiosampleName}
            </text>
          )}
          {scoreRows.map((row, i) => {
            const y = scoresStartY + i * compactLineHeight;

            return (
              <g key={i}>
                <text x={padding} y={y} fontSize={12} fontWeight="bold" fill="#000000">
                  {row.label}:
                </text>
                <text x={padding + 76} y={y} fontSize={12} fill="#000000">
                  {row.score}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
