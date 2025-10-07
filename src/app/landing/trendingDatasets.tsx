import React from "react";
import { Grid, Grow, Box, Stack, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import { useGrowOnScroll } from "app/page";
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from "@mui/material/styles";
import Config from "../../config.json";

export interface TrendingDatasetsProps {
    assembly: string;
}

const trendingDataSets = [
    { name: "All Candidate Enhancers", subtitle: "pELS & dELS (1,718,669)", size: "94.4 MB", link: Config.Downloads.HumanEnhancers },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
];
const TrendingDatasets: React.FC<TrendingDatasetsProps> = ({
    assembly,
}) => {
    const theme = useTheme();

    const {
        visible: trendingVisible,
        refs: trendingRefs
    } = useGrowOnScroll(trendingDataSets.length);

    return (
        <Grid container spacing={5} justifyContent="flex-start" marginTop={2}>
            {trendingDataSets.map((data, index) => (
                <Grow
                    in={trendingVisible[index]}
                    timeout={800 + index * 300}
                    key={`trending-${index}`}
                >
                    <Grid
                        ref={(el) => { trendingRefs.current[index] = el }}
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
                            borderRadius={3}
                            component={Link}
                            href={data.link}
                            sx={{
                                minHeight: 160,
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
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {data.name}
                                </Typography>
                                <Typography variant="body1">
                                    {data.subtitle}
                                </Typography>
                                <Typography variant="body2">
                                    {data.size}
                                </Typography>
                            </Stack>
                            <IconButton
                                sx={{
                                    alignSelf: "flex-end",
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
}


export default TrendingDatasets;