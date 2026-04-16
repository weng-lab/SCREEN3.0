import { Box, Tooltip, Typography } from "@mui/material";
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
import Button from "@mui/material/Button";
import { useScreenshot } from "use-react-screenshot";
import { gql } from "common/types/generated";
import { useRef } from "react";
import { useQuery } from "@apollo/client";
import { AnyOpenEntity } from "common/OpenEntitiesContext";
import { CcreClass } from "common/types/globalTypes";
import { CLASS_COLORS } from "common/colors";
import { CLASS_DESCRIPTIONS } from "common/consts";

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

const HeatmapPlot = ({
  src,
  alt,
  title,
  point,
}: {
  src: StaticImageData;
  alt: string;
  title: string;
  point: { x: number; y: number; accession: string; group: CcreClass; color: string };
}) => {
  const plotHeight = PLOT_WIDTH * (src.height / src.width);
  const xScale = src.width / src.height;

  return (
    <Box>
      <Typography mb={1}>{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            transform: "rotate(270deg)",
            mr: 0.5,
          }}
          variant="body2"
        >
          N1
        </Typography>
        <Box>
          <Box sx={{ position: "relative", width: PLOT_WIDTH, height: plotHeight }}>
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
                title="G1: highly conserved elements (N1 ≥ 120 and N2 ≤ 25)"
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
                title="G2: actively evolving elements (20 ≤ N1 ≤ 50 and N2 ≤ 120)"
              >
                <rect fill="transparent" x={0} y={240 - 50} width={120 * xScale} height={30} />
              </Tooltip>
              <Tooltip arrow placement="bottom" title="G3: primate-specific elements (N1 ≤ 50 and N2 ≥ 180)">
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
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            N2
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Legend = () => (
  <Box
    border={(theme) => `1px solid ${theme.palette.divider}`}
    borderRadius={1}
    padding={2}
    mb={2}
    width={"fit-content"}
    height={"min-content"}
  >
    <Typography>Axes:</Typography>
    <Typography variant="body2">
      N1: Number of aligned species with ≥90% coverage of the cCRE’s nucleotide positions
    </Typography>
    <Typography variant="body2">N2: Number of species with ≤10% coverage</Typography>
    <Typography mt={1}>Groups:</Typography>
    <Typography variant="body2">G1 (red): highly conserved elements (N1 ≥ 120 and N2 ≤ 25)</Typography>
    <Typography variant="body2">G2 (green): actively evolving elements (20 ≤ N1 ≤ 50 and N2 ≤ 120)</Typography>
    <Typography variant="body2">G3 (blue): primate-specific elements (N1 ≤ 50 and N2 ≥ 180)</Typography>
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
  const heatmapsRef = useRef<HTMLDivElement>(null);
  const [_, takeScreenshot] = useScreenshot();

  const download = () => {
    if (!heatmapsRef.current) return;

    takeScreenshot(heatmapsRef.current).then((img) => {
      const a = document.createElement("a");
      a.href = img;
      a.download = `${entity.entityID}.png`;
      a.click();
    });
  };

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
    <Box>
      <Box ref={heatmapsRef} sx={{ display: "flex", gap: 2, flexDirection: "row", flexWrap: "wrap" }}>
        <HeatmapPlot
          src={imgSrc}
          alt={`${group} plot`}
          title={`Class: ${CLASS_DESCRIPTIONS[group]}`}
          point={heatmapPoint}
        />
        <HeatmapPlot src={AllcCREs} alt="All cCRE classes" title="All cCRE classes" point={heatmapPoint} />
        <Legend />
      </Box>
      <Button variant="outlined" color="primary" size="small" onClick={download}>
        Download Plots
      </Button>
    </Box>
  );
};
