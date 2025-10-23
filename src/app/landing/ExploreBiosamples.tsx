import React from "react";
import { Grid, Grow, Box, Stack, Typography, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import { useGrowOnScroll } from "common/hooks/useGrowOnScroll";

const species = [
    { assembly: "GRCh38", name: "Human", img: "/human.png" },
    { assembly: "mm10", name: "Mouse", img: "/mouse.png" },
];

const ExploreBiosamples: React.FC = () => {

    const {
        visible: visible,
        refs: popularRefs
    } = useGrowOnScroll(species.length);

    return (
        <Grid container spacing={{xs: 5, md: 10, lg: 20}} marginTop={6} width={"100%"} paddingX={{ xs: 0, md: 5, lg: 10 }}>
            {species.map((assembly, index) => (
                <Grow
                    in={visible[index]}
                    timeout={800 + index * 300}
                    key={`${assembly.assembly}-${index}`}
                >
                    <Grid
                        ref={(el) => {
                            popularRefs.current[index] = el;
                        }}
                        data-index={index}
                        size={{xs: 12, md: 6}}
                    >
                        <Box
                            component={Link}
                            href={`/${assembly.assembly}/biosamples`}
                            sx={{
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                borderRadius: 3,
                                backgroundImage: `url(${assembly.img})`,
                                backgroundColor: "#b9cbff",
                                backgroundSize: "contain",
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
                                        color: theme => theme.palette.primary.light
                                    }}
                                >

                                    {assembly.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme => theme.palette.primary.light }}>
                                    {assembly.assembly}
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
}


export default ExploreBiosamples;