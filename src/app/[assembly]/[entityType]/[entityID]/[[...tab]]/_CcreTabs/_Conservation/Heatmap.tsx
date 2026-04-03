import { Box, Tooltip, Typography } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import AllcCREs from "public/conservation/AllcCREs.png";
import PromoterImg from "public/conservation/Promoter.png";
import ProximalEnhancerImg from "public/conservation/ProximalEnhancer.png";
import CACTCFImg from "public/conservation/CA-CTCF.png";
import CAH3K4me3Img from "public/conservation/CA-H3K4me3.png";
import CATFImg from "public/conservation/CA-TF.png";
import CAImg from "public/conservation/CA.png";
import DistalEnhancerImg from "public/conservation/DistalEnhancer.png";
import TFImg from "public/conservation/TF.png";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useScreenshot } from "use-react-screenshot";
import { gql } from "common/types/generated";
import { useRef } from "react";
import { useQuery } from "@apollo/client";
import { AnyOpenEntity } from "common/OpenEntitiesContext";
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

const plotWidth = 250;

const HeatmapPlot = ({
  src,
  alt,
  title,
  point,
  accession,
}: {
  src: StaticImageData;
  alt: string;
  title: string;
  point: { x: number; y: number };
  accession: string
}) => {
  const plotHeight = plotWidth * (src.height / src.width);

  return (
    <Box>
      <Typography mb={1}>{title}</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            mr: 0.5,
          }}
          variant="body2"
        >
          N1
        </Typography>
        <Box>
          <Box sx={{ position: "relative", width: plotWidth, height: plotHeight }}>
            <Image src={src} alt={alt} width={plotWidth} height={plotHeight} unoptimized />
            <svg
              viewBox="0 0 240 240"
              width={plotWidth}
              height={plotHeight}
              preserveAspectRatio="xMinYMin meet"
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <Tooltip title="G1: highly conserved elements (N1 ≥ 120 and N2 ≤ 25)">
                <rect fill="transparent" x={0} y={0} width={33} height={122} />
              </Tooltip>
              <Tooltip title="G2: actively evolving elements (20 ≤ N1 ≤ 50 and N2 ≤ 120)">
                <rect fill="transparent" x={0} y={187} width={146} height={34} />
              </Tooltip>
              <Tooltip title="G3: primate-specific elements (N1 ≤ 50 and N2 ≥ 180)">
                <rect fill="transparent" x={214} y={187} width={74} height={53} />
              </Tooltip>
              <Tooltip title={`${accession}: N1 = ${point.y}, N2 = ${point.x}`}>
                <circle cx={point.x} cy={240 - point.y} r={5} fill="red" stroke="white" strokeWidth={2} />
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

  const cCREType = heatmapData ? CLASS_DESCRIPTIONS[heatmapData.conservationHeatmapQuery[0].ccre_class] : "";

  const imgSrc =
    cCREType === "Promoter"
      ? PromoterImg
      : cCREType === "Proximal Enhancer"
        ? ProximalEnhancerImg
        : cCREType === "CA-CTCF"
          ? CACTCFImg
          : cCREType === "CA-H3K4me3"
            ? CAH3K4me3Img
            : cCREType === "CA-TF"
              ? CATFImg
              : cCREType === "CA"
                ? CAImg
                : cCREType === "Distal Enhancer"
                  ? DistalEnhancerImg
                  : cCREType === "TF"
                    ? TFImg
                    : AllcCREs;

  const point = heatmapData?.conservationHeatmapQuery?.[0];

  return (
    <>
      {heatmapLoading && entity.assembly !== "mm10" && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      {point && entity.assembly !== "mm10" && (
        <Box>
          <Box
            border={(theme) => `1px solid ${theme.palette.divider}`}
            borderRadius={1}
            padding={2}
            mb={2}
            width={"fit-content"}
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
          <Box ref={heatmapsRef} sx={{ display: "flex", gap: 5, flexDirection: "row", flexWrap: "wrap" }}>
            <HeatmapPlot
              src={AllcCREs}
              alt="All cCRE Regions plot"
              title="All cCRE Regions"
              point={{ x: point.x_coord, y: point.y_coord }}
              accession={point.accession}
            />
            <HeatmapPlot
              src={imgSrc}
              alt={`${cCREType} plot`}
              title={cCREType}
              point={{ x: point.x_coord, y: point.y_coord }}
              accession={point.accession}
            />
          </Box>
          <Button variant="outlined" color="primary" size="small" onClick={download}>
            Download Plots
          </Button>
        </Box>
      )}
    </>
  );
};
