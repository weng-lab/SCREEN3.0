import React from "react";
import { Grid, Grow, Box, Stack, Typography, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { useGrowOnScroll } from "common/hooks/useGrowOnScroll";

export interface PopularSearchesProps {
  assembly: string;
}

const popularSearchesGRCh38 = [
  { entity: "Gene", name: "SOX4", region: "chr6:21,592,768-21,598,619" },
  { entity: "cCRE", name: "EH38E3314260", region: "chr19:50,417,519-50,417,853" },
  { entity: "Variant", name: "rs9466027", region: "chr6:21,298,226-21,298,227" },
  { entity: "Region", name: "chr12:53380176-53416446", region: "chr12:53380176-53416446" },
  { entity: "GWAS", name: "Adiponectin Levels", region: "Dastani Z" },
  { entity: "Gene", name: "APOE", region: "chr19:44,905,754-44,909,393" },
  // { entity: "Biosample", name: "Brain", region: "chr6:21,298,226-21,298,227" },
];

const popularSearchesMM10 = [
  { entity: "Gene", name: "Sp1", region: "chr15:102,406,143-102,436,404" },
  { entity: "cCRE", name: "EM10E1179536", region: "chr7:19,698,911-19,699,257" },
  { entity: "Region", name: "chr7:19,696,109-19,699,188", region: "chr7:19,696,109-19,699,188" },
  // { entity: "Gene", name: "Apoe", region: "chr7:19,696,109-19,699,188" },
  // { entity: "cCRE", name: "EM10E0000229", region: "chr1:32,965,032-32,965,317" },
  // { entity: "Biosample", name: "Brain", region: "chr13:28,948,919-28,953,713" },
];

const PopularSearches: React.FC<PopularSearchesProps> = ({ assembly }) => {
  const popularSearches = assembly === "GRCh38" ? popularSearchesGRCh38 : popularSearchesMM10;

  const { visible: popularSearchesVisible, refs: popularRefs } = useGrowOnScroll(popularSearches.length);

  return (
    <Grid container spacing={5} justifyContent="flex-start" marginTop={6} width={"100%"}>
      {popularSearches.map((entity, index) => (
        <Grow
          in={popularSearchesVisible[index]}
          timeout={800 + index * 300}
          key={`${assembly}-${entity.name}-${index}`}
        >
          <Grid
            ref={(el) => {
              popularRefs.current[index] = el;
            }}
            data-index={index}
            size={{ xs: 12, md: 4 }}
          >
            <Box
              component={Link}
              href={
                entity.entity === "GWAS"
                  ? `/GRCh38/gwas/Dastani_Z-22479202-Adiponectin_levels`
                  : `/${assembly}/${entity.entity.toLowerCase()}/${entity.name}`
              }
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                borderRadius: 3,
                background: (theme) =>
                  `linear-gradient(135deg, #283593 0%, #1a237e 25%, ${theme.palette.primary.main} 100%)`,
                color: "white",
                height: 160,
                p: 3,
                boxShadow: 3,
                textDecoration: "none",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transformOrigin: "center",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                  zIndex: 2,
                },
              }}
            >
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {entity.region}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {entity.entity}: {entity.name}
                </Typography>
              </Stack>
              <IconButton
                sx={{
                  backgroundColor: "#515bb8",
                  color: "white",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grow>
      ))}
    </Grid>
  );
};

export default PopularSearches;
