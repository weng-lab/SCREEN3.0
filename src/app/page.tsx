//Home Page
"use client";
import { Box, Button, Grow, Grid2, IconButton, Link, Stack, Typography, Collapse } from "@mui/material";
import React, { useState } from "react";
import { theme } from "./theme";
import { alpha } from '@mui/material/styles';
import Image from "next/image"
import MainSearch from "./landing/mainSearch";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import MultipleRegionSearch from "./landing/multipleRegionSearch";

export default function Home() {
  const [assembly, setAssembly] = useState<"GRCh38" | "mm10">('GRCh38');
  const [multipleRegionSearchVisible, setMultipleRegionSearchVisible] = useState(false);

  const handleAssemblyChange = (asmb: "GRCh38" | "mm10") => {
    setAssembly(asmb);
  }

  const toggleMultipleRegionSearchVisible = () => {
    setMultipleRegionSearchVisible(!multipleRegionSearchVisible);
  }

  const popularSearchesGRCh38 = [
    { entity: "Gene", name: "APOE", region: "chr8:12,000,000-12,500,000" },
    { entity: "cCRE", name: "EH38E3314260", region: "chr19:50,417,519-50,417,853" },
    { entity: "Variant", name: "rs9466027", region: "chr6:21,298,226-21,298,227" },
  ];

  const popularSearchesMM10 = [
    { entity: "Gene", name: "Sox2", region: "chr3:34,456,789-34,500,000" },
    { entity: "cCRE", name: "EM10E1234567", region: "chr11:65,789,000-65,789,345" },
    { entity: "Variant", name: "rs123456", region: "chr2:21,000,000-21,000,001" },
  ];

  const popularSearches = assembly === "GRCh38" ? popularSearchesGRCh38 : popularSearchesMM10;

  const trendingDataSets = [
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
  ];

  //@todo: Fix the coloring, add all colors to theme
  //Add actual download links
  return (
    <div>
      <Box
        width="100%"
        height={"auto"}
        paddingY={20}
        sx={{
          background: `
            linear-gradient(${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.75)}),
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
            id="header-helix"
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
        <MainSearch assembly={assembly} handleAssemblyChange={handleAssemblyChange} />
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            mx: "auto",
          }}
        >
          <Typography
            variant="subtitle2"
            color="#b2bcf0"
            textAlign={{ xs: "center", md: "right" }}
          >
            Looking to search multiple regions?{" "}
            <span
              onClick={toggleMultipleRegionSearchVisible}
              style={{ color: "#b2bcf0", textDecoration: "underline", cursor: "pointer" }}
            >
              Click here!
            </span>
          </Typography>
        </Box>
        <Collapse in={multipleRegionSearchVisible} sx={{width: "100%"}} timeout={500}>
          <MultipleRegionSearch assembly={assembly} toggleMultipleRegionSearchVisible={toggleMultipleRegionSearchVisible} />
        </Collapse>
      </Box>
      <Box width={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}>
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
        <Grid2 container spacing={5} justifyContent="flex-start" marginTop={6} width={"100%"}>
          {popularSearches.map((entity, index) => (
            <Grow in timeout={800 + index * 300} key={`${assembly}-${index}`}>
              <Grid2
                size={{ xs: 12, md: 4 }}
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
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {entity.region}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                    alignSelf: "flex-end",
                  }}
                  LinkComponent={Link}
                href={`/${assembly}/${entity.entity.toLowerCase()}/${entity.name}`}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Grid2>
            </Grow>
          ))}
        </Grid2>
      </Box>
      <Box width={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}>
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
            <Box sx={{ maxWidth: 400, width: "100%", mt: { xs: 10, md: 0 } }}>
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
                sx={{ backgroundColor: theme.palette.primary.light }}
              >
                Go to Downloads
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <Box width={"100%"} justifyContent={"flex-start"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}>
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
              // href={``}
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