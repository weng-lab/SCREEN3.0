import { Alert, Box, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import AllcCREs from "public/conservation/AllcCREs.png";
import PromoterImg from "public/conservation/PLS.png";
import ProximalEnhancerImg from "public/conservation/pELS.png";
import CACTCFImg from "public/conservation/CA-CTCF.png";
import CAH3K4me3Img from "public/conservation/CA-H3K4me3.png";
import CATFImg from "public/conservation/CA-TF.png";
import CAImg from "public/conservation/CA.png";
import DistalEnhancerImg from "public/conservation/dELS.png";
import TFImg from "public/conservation/TF.png";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import { useScreenshot } from "use-react-screenshot";
import { gql } from "common/types/generated";
import { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { AnyOpenEntity } from "common/OpenEntitiesContext";
import { CcreClass } from "common/types/globalTypes";
import { CitationInfoAlert } from "./CitationInfoAlert";
import { CLASS_COLORS, CLASS_DESCRIPTIONS } from "common/ccre";

const CONSERVATION_HEATMAP_QUERY = gql(`
    query getconservationHeatmapCoords($accession: [String]!) {
      conservationHeatmapQuery(accession: $accession) {
        x_coord
        y_coord
        accession
        ccre_class
      }
    }
  `);

const PLOT_WIDTH = 300;
const AXIS_SIZE = 25;
const N1_LABEL_WIDTH = 20;
const TICKS = [0, 120, 240];

const HeatmapPlot = ({
  src,
  alt,
  title,
  point,
  downloadName,
}: {
  src: StaticImageData;
  alt: string;
  title: string;
  point: { x: number; y: number; accession: string; group: CcreClass; color: string };
  downloadName: string;
}) => {
  const plotHeight = PLOT_WIDTH * (src.height / src.width);
  const xScale = src.width / src.height;

  const plotRef = useRef<HTMLDivElement>(null);
  const [, takeScreenshot] = useScreenshot();

  const download = () => {
    if (!plotRef.current) return;

    takeScreenshot(plotRef.current).then((img) => {
      const a = document.createElement("a");
      a.href = img;
      a.download = `${downloadName}.png`;
      a.click();
    });
  };

  return (
    <Box ref={plotRef}>
      <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
        <Typography>{title}</Typography>
        <Tooltip arrow title="Download plot">
          <IconButton data-html2canvas-ignore="true" size="small" onClick={download}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gridTemplateRows: "auto auto auto",
          width: "fit-content",
        }}
      >
        <Box
          sx={{
            gridRow: 1,
            gridColumn: 1,
            position: "relative",
            width: N1_LABEL_WIDTH,
            height: plotHeight,
            alignSelf: "center",
            mr: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: plotHeight,
              transform: "translate(-50%, -50%) rotate(270deg)",
              textAlign: "center",
            }}
          >
            N₁
          </Typography>
        </Box>
        <Box
          component="svg"
          width={AXIS_SIZE}
          height={plotHeight}
          sx={{ gridRow: 1, gridColumn: 2, display: "block", color: "text.secondary" }}
        >
          <line
            x1={AXIS_SIZE}
            y1={0}
            x2={AXIS_SIZE}
            y2={plotHeight}
            stroke="currentColor"
            strokeWidth={1}
          />
          {TICKS.map((v) => {
            const y = (1 - v / 240) * plotHeight;
            const baseline = v === 240 ? "hanging" : v === 0 ? "alphabetic" : "middle";
            return (
              <g key={v}>
                <line
                  x1={AXIS_SIZE - 5}
                  y1={y}
                  x2={AXIS_SIZE}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={1}
                />
                <text
                  x={AXIS_SIZE - 7}
                  y={y}
                  textAnchor="end"
                  dominantBaseline={baseline}
                  fontSize={10}
                  fill="currentColor"
                >
                  {v}
                </text>
              </g>
            );
          })}
        </Box>
        <Box
          sx={{
            gridRow: 1,
            gridColumn: 3,
            position: "relative",
            width: PLOT_WIDTH,
            height: plotHeight,
          }}
        >
          <Image src={src} alt={alt} fill unoptimized priority />
            <svg
              viewBox={`0 0 ${240 * xScale} 240`}
              width={PLOT_WIDTH}
              height={plotHeight}
              preserveAspectRatio="xMinYMin meet"
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <Tooltip
                arrow
                placement="right-start"
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [25, 20],
                        },
                      },
                    ],
                  },
                }}
                title="G1: highly conserved cCREs (N1 ≥ 120 and N2 ≤ 25)"
              >
                <rect fill="transparent" x={0} y={0} width={25 * xScale} height={240 - 120} />
              </Tooltip>
              <Tooltip
                arrow
                placement="bottom"
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [0, 21],
                        },
                      },
                    ],
                  },
                }}
                title="G2: actively evolving cCREs (20 ≤ N1 ≤ 50 and N2 ≤ 120)"
              >
                <rect fill="transparent" x={0} y={240 - 50} width={120 * xScale} height={30} />
              </Tooltip>
              <Tooltip arrow placement="bottom" title="G3: primate-specific cCREs (N1 ≤ 50 and N2 ≥ 180)">
                <rect fill="transparent" x={180 * xScale} y={240 - 50} width={(240 - 180) * xScale} height={50} />
              </Tooltip>
              <Tooltip arrow title={`${point.accession} (${point.group}): N1 = ${point.y}, N2 = ${point.x}`}>
                <circle
                  cx={point.x * xScale}
                  cy={240 - point.y}
                  r={6}
                  fill={point.color}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    transition: "transform 0.15s ease-in-out",
                    transformOrigin: `${point.x * xScale}px ${240 - point.y}px`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => e.currentTarget.setAttribute("transform", `scale(1.25)`)}
                  onMouseLeave={(e) => e.currentTarget.removeAttribute("transform")}
                />
              </Tooltip>
          </svg>
        </Box>
        <Box
          component="svg"
          width={PLOT_WIDTH}
          height={AXIS_SIZE}
          sx={{ gridRow: 2, gridColumn: 3, display: "block", color: "text.secondary" }}
        >
          <line x1={0} y1={0} x2={PLOT_WIDTH} y2={0} stroke="currentColor" strokeWidth={1} />
          {TICKS.map((v) => {
            const x = (v / 240) * PLOT_WIDTH;
            const anchor = v === 0 ? "start" : v === 240 ? "end" : "middle";
            return (
              <g key={v}>
                <line x1={x} y1={0} x2={x} y2={5} stroke="currentColor" strokeWidth={1} />
                <text x={x} y={17} textAnchor={anchor} fontSize={10} fill="currentColor">
                  {v}
                </text>
              </g>
            );
          })}
        </Box>
        <Typography
          variant="body2"
          sx={{ gridRow: 3, gridColumn: 3, width: PLOT_WIDTH, textAlign: "center" }}
        >
            N₂
        </Typography>
      </Box>
    </Box>
  );
};

const AXIS_ITEMS = [
  {
    label:
      "N₁: number of other mammalian genomes, out of 240 total, to which ≥90% of the human cCRE's positions could be aligned",
  },
  {
    label:
      "N₂: number of other mammalian genomes, out of 240 total, to which ≤10% of the human cCRE's positions could be aligned",
  },
];

const GROUP_ITEMS = [
  { color: "red", label: "G1: highly conserved cCREs (N1 ≥ 120 and N2 ≤ 25)" },
  { color: "green", label: "G2: actively evolving cCREs (20 ≤ N1 ≤ 50 and N2 ≤ 120)" },
  { color: "blue", label: "G3: primate-specific cCREs (N1 ≤ 50 and N2 ≥ 180)" },
]

const Legend = () => (
  <Box
    border={(theme) => `1px solid ${theme.palette.divider}`}
    borderRadius={1}
    padding={2}
  >
    {AXIS_ITEMS.map(({ label }) => (
      <Typography key={label} variant="body2">{label}</Typography>
    ))}
    <Divider sx={{mt: 1, mb: 0.5}} />
    {GROUP_ITEMS.map(({ color, label }) => (
      <Stack key={label} direction="row" alignItems="center" spacing={1}>
        {color && <Box sx={{ width: 12, height: 12, backgroundColor: color, flexShrink: 0, borderRadius: 0.5 }} />}
        <Typography variant="body2">{label}</Typography>
      </Stack>
    ))}
  </Box>
);

const getImageSrc = (group: CcreClass): StaticImageData => {
  switch (group) {
    case "PLS":
      return PromoterImg;
    case "pELS":
      return ProximalEnhancerImg;
    case "dELS":
      return DistalEnhancerImg;
    case "CA-CTCF":
      return CACTCFImg;
    case "CA-H3K4me3":
      return CAH3K4me3Img;
    case "CA-TF":
      return CATFImg;
    case "CA":
      return CAImg;
    case "TF":
      return TFImg;
    default:
      return AllcCREs;
  }
};

export const Heatmap = ({ entity }: { entity: AnyOpenEntity }) => {
  const {
    data: heatmapData,
    loading: heatmapLoading,
    error: heatmapError,
  } = useQuery(CONSERVATION_HEATMAP_QUERY, {
    variables: { accession: [entity.entityID] },
  });

  const group = heatmapData ? (heatmapData.conservationHeatmapQuery[0].ccre_class as CcreClass) : null;

  const imgSrc = getImageSrc(group);

  const pointData = heatmapData?.conservationHeatmapQuery?.[0];

  const heatmapPoint = {
    x: pointData?.x_coord,
    y: pointData?.y_coord,
    accession: pointData?.accession,
    group,
    color: CLASS_COLORS[group],
  };

  if (heatmapLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={2} alignItems={"flex-start"}>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "row", flexWrap: "wrap" }}>
        <HeatmapPlot
          src={imgSrc}
          alt={`${group} plot`}
          title={`Class: ${CLASS_DESCRIPTIONS[group]}`}
          point={heatmapPoint}
          downloadName={`${entity.entityID}_${group}`}
        />
        <HeatmapPlot
          src={AllcCREs}
          alt="All cCRE classes"
          title="All cCRE classes"
          point={heatmapPoint}
          downloadName={`${entity.entityID}_all-cCRE-classes`}
        />
      </Box>
      <Legend />
      <CitationInfoAlert />
    </Stack>
  );
};
