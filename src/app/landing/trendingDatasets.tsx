import React from "react";
import { Grid, Grow, Box, Stack, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@mui/material/styles";
import Config from "config.json";
import { useGrowOnScroll } from "common/hooks/useGrowOnScroll";
import HumanIcon from "common/components/HumanIcon";
import MouseIcon from "common/components/MouseIcon";

const trendingDataSets = [
  {
    name: "All Human cCREs",
    subtitle: "2,348,854 cCREs • 1,888 cell types",
    size: "129.1 MB",
    link: Config.Downloads.HumanCCREs,
  },
  { name: "Human Promoters", subtitle: "47,532 cCREs", size: "2.6 MB", link: Config.Downloads.HumanPromoters },
  { name: "Human Enhancers", subtitle: "1,718,669 cCREs", size: "94.4 MB", link: Config.Downloads.HumanEnhancers },
  {
    name: "All Mouse cCREs",
    subtitle: "926,843 cCREs • 366 cell types",
    size: "50.6 MB",
    link: Config.Downloads.MouseCCREs,
  },
  { name: "Mouse Promotes", subtitle: "27,332 cCREs", size: "1.5 MB", link: Config.Downloads.MousePromoters },
  { name: "Mouse Enhancers", subtitle: "512,001 cCREs", size: "28.2 MB", link: Config.Downloads.MouseEnhancers },
];

const TrendingDatasets: React.FC = ({}) => {
  const theme = useTheme();

  const { visible: trendingVisible, refs: trendingRefs } = useGrowOnScroll(trendingDataSets.length);

  return (
    <Grid container spacing={5} justifyContent="flex-start" marginTop={2}>
      {trendingDataSets.map((data, index) => (
        <Grow in={trendingVisible[index]} timeout={800 + index * 300} key={`trending-${index}`}>
          <Grid
            ref={(el) => {
              trendingRefs.current[index] = el;
            }}
            data-index={index}
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-start"
              position="relative"
              borderRadius={3}
              component={Link}
              href={data.link}
              sx={{
                height: 160,
                p: 3,
                boxShadow: 3,
                justifyContent: "space-between",
                textDecoration: "none",
                textTransform: "none",
                color: "inherit",
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
                  {data.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {data.subtitle}
                </Typography>
                <Typography variant="body2">{data.size}</Typography>
              </Stack>
              {data.name.includes("Human") && (
                <Box position={"absolute"} top={20} right={20}>
                  <HumanIcon size={40} />
                </Box>
              )}
              {data.name.includes("Mouse") && (
                <Box position={"absolute"} top={20} right={20}>
                  <MouseIcon size={40} />
                </Box>
              )}
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.primary.light,
                  borderRadius: 3,
                  padding: 1,
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grow>
      ))}
    </Grid>
  );
};

export default TrendingDatasets;
