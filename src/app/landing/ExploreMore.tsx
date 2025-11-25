import React from "react";
import { Grid, Grow, Box, Stack, Typography, Button, Tooltip } from "@mui/material";
import Link from "next/link";
import { useGrowOnScroll } from "common/hooks/useGrowOnScroll";

const cards = [
  {
    assembly: "GRCh38",
    name: "GWAS",
    subtitle: "Explore Genome-Wide Association Studies (GWAS).",
    link: "/GRCh38/gwas",
    img: "/treemap.svg",
    size: 300,
    disabled: false,
  },
  {
    assembly: "GRCh38",
    name: "Human",
    subtitle: "Visualize and explore human biosamples across diverse tissues and cell types from ENCODE.",
    link: "/GRCh38/biosamples",
    img: "/human.png",
    size: 200,
    disabled: true,
  },
  {
    assembly: "mm10",
    name: "Mouse",
    subtitle: "Visualize and explore Mouse biosamples across diverse tissues and cell types from ENCODE.",
    link: "/mm10/biosamples",
    img: "/mouse.png",
    size: 400,
    disabled: true,
  },
];

const ExploreMore: React.FC = () => {
  const { visible: visible, refs: popularRefs } = useGrowOnScroll(cards.length);

  return (
    <Grid container spacing={5} marginTop={6} width={"100%"}>
      {cards.map((card, index) => (
        <Grow in={visible[index]} timeout={800 + index * 300} key={`${card.assembly}-${index}`}>
          <Grid
            ref={(el) => {
              popularRefs.current[index] = el;
            }}
            data-index={index}
            size={{ xs: 12, md: 4 }}
          >
            <Tooltip title={card.disabled ? "Under Maintenance" : ""} arrow placement="top">
              <Stack spacing={1}>
                <Box
                  component={card.disabled ? "div" : Link}
                  href={card.disabled ? undefined : card.link}
                  sx={{
                    pointerEvents: card.disabled ? "none" : "auto",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    borderRadius: 3,
                    backgroundImage: `url(${card.img})`,
                    backgroundColor: card.disabled ? "gray" : "#b9cbff",
                    backgroundSize: `${card.size}px`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundBlendMode: "multiply",
                    color: "white",
                    height: 200,
                    p: 3,
                    boxShadow: 3,
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    transformOrigin: "center",
                    "&:hover": {
                      transform: card.disabled ? "" : "scale(1.02)",
                      boxShadow: card.disabled ? 0 : 6,
                      zIndex: 2,
                    },
                  }}
                ></Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    color: card.disabled ? "grey" : (theme) => theme.palette.primary.light,
                  }}
                >
                  {card.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {card.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: (theme) => theme.palette.primary.light, width: "fit-content", px: 2 }}
                  component={Link}
                  href={card.link}
                  disabled={card.disabled}
                >
                  Explore
                </Button>
              </Stack>
            </Tooltip>
          </Grid>
        </Grow>
      ))}
    </Grid>
  );
};

export default ExploreMore;
