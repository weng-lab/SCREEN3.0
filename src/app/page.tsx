//Home Page
"use client";
import { Box, Button, Collapse, Grid, Link, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { theme } from "./theme";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import MainSearch from "./landing/mainSearch";
import PopularSearches from "./landing/popularSearches";
import TrendingDatasets from "./landing/trendingDatasets";
import ExploreMore from "./landing/ExploreMore";
import MultipleRegionSearch from "./landing/multipleRegionSearch";

export default function Home() {
  const [assembly, setAssembly] = useState<"GRCh38" | "mm10">("GRCh38");
  const [multipleRegionSearchVisible, setMultipleRegionSearchVisible] = useState(false);

  const handleAssemblyChange = (asmb: "GRCh38" | "mm10") => {
    setAssembly(asmb);
  };

  const toggleMultipleRegionSearchVisible = () => {
    setMultipleRegionSearchVisible(!multipleRegionSearchVisible);
  };

  return (
    <div>
      <Box
        width="100%"
        height={"auto"}
        paddingY={{ xs: 10, md: 20 }}
        sx={{
          background: `
            linear-gradient(${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.main, 0.75)}),
            url("/backgroundHelix.png")
          `,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundAttachment: "fixed",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-around"
          gap={{ xs: 2, md: 4 }}
          textAlign={{ xs: "center", md: "left" }}
        >
          <Image
            src="/helix.png"
            alt="Screen Helix"
            height={120}
            width={120}
            style={{
              width: "auto",
              height: 100,
            }}
            priority
            id="header-helix"
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              fontSize: { xs: "28px", md: "40px" },
              lineHeight: { xs: "32px", md: "40px" },
              letterSpacing: 0,
              color: "white",
              width: "fit-content",
            }}
          >
            Search Candidate cis-Regulatory Elements
          </Typography>
        </Stack>
        <MainSearch assembly={assembly} handleAssemblyChange={handleAssemblyChange} />
        {/* Multiple Region Search */}
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "60%", lg: "45%" },
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            mx: "auto",
          }}
        >
          <Typography variant="subtitle2" color="#b2bcf0" textAlign={{ xs: "center", md: "right" }}>
            Looking to search multiple regions?{" "}
            <span
              onClick={toggleMultipleRegionSearchVisible}
              style={{ color: "#b2bcf0", textDecoration: "underline", cursor: "pointer" }}
            >
              Click here!
            </span>
          </Typography>
        </Box>
        <Collapse in={multipleRegionSearchVisible} sx={{ width: "100%" }} timeout={500}>
          <MultipleRegionSearch
            assembly={assembly}
            toggleMultipleRegionSearchVisible={toggleMultipleRegionSearchVisible}
          />
        </Collapse>
      </Box>
      <Box
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ paddingY: 5, paddingX: { xs: 5, md: 20 } }}
      >
        <Typography
          sx={{
            fontWeight: 550,
            fontSize: "34px",
            textAlign: "center",
          }}
        >
          Where to start?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Browse these example searches to get started with SCREEN. You can search for genes, cCREs, variants, a
          specific loci, or a study from the GWAS catalog. Change the assembly above to see different examples.
        </Typography>
        <PopularSearches assembly={assembly} />
      </Box>
      {/* <Box
        width={"100%"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ paddingY: 5, paddingX: { xs: 5, md: 20 } }}
      > */}
      <Box
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}
      >
        {/* <Typography variant="h4" sx={{ fontWeight: 550 }}>
          Explore All Biosamples and GWAS
        </Typography> */}
        <ExploreMore />
      </Box>
      <Box
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}
      >
        <Grid container width="100%" justifyContent="space-around">
          <Grid size={6} width={"auto"}>
            <Typography variant="h4" sx={{ fontWeight: 550, mb: 2 }}>
              Access SCREEN Data Instantly!
            </Typography>
            <Typography variant="body1" maxWidth={500}>
              Download comprehensive datasets of candidate cis-regulatory elements (cCREs) from ENCODE for in-depth
              analysis.
            </Typography>
          </Grid>
          <Grid size={6} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} width={"auto"}>
            <Box sx={{ maxWidth: 400, width: "100%", mt: { xs: 10, md: 0 } }}>
              <Typography variant="h6" sx={{ fontWeight: 550 }} gutterBottom>
                Available Downloads
              </Typography>
              <Typography variant="body1" gutterBottom>
                ✅ cCRE Annotations
              </Typography>
              <Typography variant="body1" gutterBottom>
                ✅ Data Matrices across multiple assays
              </Typography>
              <Typography variant="body1" marginBottom={2}>
                ✅ cCREs downloads by Genomic Region
              </Typography>
              <Button
                variant="contained"
                LinkComponent={Link}
                href="/downloads"
                sx={{ backgroundColor: theme.palette.primary.light }}
              >
                Go to Downloads
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        width={"100%"}
        justifyContent={"flex-start"}
        display={"flex"}
        flexDirection={"column"}
        sx={{ paddingY: 5, paddingX: { xs: 5, md: 20 } }}
      >
        <Typography variant="h6" sx={{ fontWeight: 550 }}>
          📈 Trending Datasets
        </Typography>
        <TrendingDatasets />
      </Box>
    </div>
  );
}
