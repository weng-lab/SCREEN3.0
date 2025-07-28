//Home Page
"use client";
import { Box, Button, Grid2, IconButton, Link, Stack, Typography } from "@mui/material";
import React from "react";
import { theme } from "./theme";
import { alpha } from '@mui/material/styles';
import Image from "next/image"
import MainSearch from "./landing/mainSearch";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';

export default function Home() {

  const popularSearches = [
    { enitiy: "Gene", name: "APOE", region: "chr8:12,000,000-12,500,000" },
    { enitiy: "cCRE", name: "EH38E3314260", region: "chr19:50,417,519-50,417,853" },
    { enitiy: "Variant", name: "rs9466027", region: "chr6:21,298,226-21,298,227" },
  ];

  const trendingDataSets = [
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
  ];

  //@todo: mobile freindly
  //Fix the coloring, add all colors to theme
  return (
    <div>
      <Box
        width="100%"
        height="70vh"
        sx={{
          background: `
            linear-gradient(${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.9)}),
            url("/backgroundHelix.png")
          `,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={4}>
          <Image
            src="/helix.png"
            alt="Screen Helix"
            height={120}
            width={120}
            style={{ width: "auto", height: 120 }}
            priority
          />
          <Typography variant="h4"
            sx={{
              fontWeight: 400,
              fontSize: '40px',
              lineHeight: '40px',
              letterSpacing: 0,
              color: 'white',
              textAlign: 'center',
            }}
          >
            Search Candidate cis-Regulatory Elements
          </Typography>
        </Stack>
        <MainSearch />
      </Box>
      <Box width={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: 20 }}>
        <Typography
          sx={{
            fontWeight: 550,
            fontSize: '34px',
            textAlign: 'center',
          }}
        >
          Where to start?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          Browse these example searches to get started with SCREEN. You can search for genes, cCREs, variants, or specific loci.
        </Typography>
        <Grid2 container spacing={5} justifyContent="flex-start" marginTop={6} width={"100%"} >
          {popularSearches.map((entity, index) => (
            <Grid2
              key={index}
              size={{
                xs: 12,
                md: 4,
              }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-start"
              borderRadius={3}
              sx={{
                background: (theme) =>
                  `linear-gradient(135deg, #283593 0%, #1a237e 25%, ${theme.palette.primary.main} 100%)`,
                color: "white",
                minHeight: 160,
                p: 3,
                boxShadow: 3,
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  {entity.region}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {entity.enitiy}: {entity.name}
                </Typography>
              </Stack>
              <IconButton
                sx={{
                  backgroundColor: "#515bb8",
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  alignSelf: 'flex-end',
                }}
                LinkComponent={Link}
              // href={`/${elementType}/${element.name}`}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Grid2>
          ))}
        </Grid2>
      </Box>
      <Box width={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: 20 }}>
        <Grid2
          container
          width="100%"
          justifyContent="space-around"
        >
          <Grid2 size={6} width={"auto"}>
            <Typography variant="h4" sx={{ fontWeight: 550, mb: 2 }}>
              Access SCREEN Data Instantly!
            </Typography>
            <Typography variant="body1" maxWidth={500}>
              Download comprehensive datasets of candidate cis-Regulatory Elements (cCREs) from ENCODE for in-depth analysis.
            </Typography>
          </Grid2>
          <Grid2 size={6} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} width={"auto"}>
            <Box sx={{ maxWidth: 400, width: "100%" }}>
              <Typography variant="h6" sx={{ fontWeight: 550 }} gutterBottom>
                Available Downloads
              </Typography>
              <Typography variant="body1" gutterBottom>✅ cCRE Annotations</Typography>
              <Typography variant="body1" gutterBottom>✅ Data Matrices across multiple assays</Typography>
              <Typography variant="body1" marginBottom={2}>✅ cCREs downloads by Genomic Region</Typography>
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/downloads"
                sx={{backgroundColor: theme.palette.primary.light}}
              >
                Go to Downloads
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <Box width={"100%"} justifyContent={"flex-start"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: 20 }}>
        <Typography variant="h6" sx={{ fontWeight: 550 }}>📈 Trending Datasets</Typography>
        <Grid2 container spacing={5} justifyContent="flex-start" marginTop={2}>
          {trendingDataSets.map((data, index) => (
            <Grid2
              key={index}
              size={{
                xs: 12,
                md: 4,
              }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="flex-start"
              borderRadius={3}
              sx={{
                minHeight: 160,
                p: 3,
                boxShadow: 3,
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {data.name}
                </Typography>
                <Typography variant="body2">
                  ({data.size})
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
                LinkComponent={Link}
              // href={`/${elementType}/${element.name}`}
              >
                <DownloadIcon />
              </IconButton>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </div>
  );
}