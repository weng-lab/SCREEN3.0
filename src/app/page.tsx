//Home Page
"use client";
import { Box, Button, Grow, Grid, IconButton, Link, Stack, Typography, Collapse } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "./theme";
import { alpha } from '@mui/material/styles';
import Image from "next/image"
import MainSearch from "./landing/mainSearch";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import MultipleRegionSearch from "./landing/multipleRegionSearch";
import Config from "../config.json";

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
    { entity: "Gene", name: "SOX4", region: "chr6:21,592,768-21,598,619" },
    { entity: "cCRE", name: "EH38E3314260", region: "chr19:50,417,519-50,417,853" },
    { entity: "Variant", name: "rs9466027", region: "chr6:21,298,226-21,298,227" },
    { entity: "Region", name: "chr12:53380176-53416446", region: "chr12:53380176-53416446" },
    { entity: "GWAS", name: "Adiponectin Levels", region: "Dastani Z" },
    { entity: "Gene", name: "APOE", region: "chr19:44,905,754-44,909,393" },
    // { entity: "Biosample", name: "Brain", region: "chr6:21,298,226-21,298,227" },
  ];

  const popularSearchesMM10 = [
    { entity: "Gene", name: "Sox4", region: "chr13:28,948,919-28,953,713" },
    { entity: "cCRE", name: "EM10E0000207", region: "chr1:26,047,867-26,048,149" },
    { entity: "Region", name: "chr12:53380176-53416446", region: "chr12:53380176-53416446" },
    // { entity: "Gene", name: "Apoe", region: "chr7:19,696,109-19,699,188" },
    // { entity: "cCRE", name: "EM10E0000229", region: "chr1:32,965,032-32,965,317" },
    // { entity: "Biosample", name: "Brain", region: "chr13:28,948,919-28,953,713" },
  ];

  const popularSearches = assembly === "GRCh38" ? popularSearchesGRCh38 : popularSearchesMM10;

  const trendingDataSets = [
    { name: "All Candidate Enhancers", subtitle: "pELS & dELS (1,718,669)", size: "94.4 MB", link: Config.Downloads.HumanEnhancers },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
    { name: "All Candidate Enhancers", subtitle: "", size: "129.1 MB", link: "/downloads/ccre/enhancers" },
  ];

  //Grow cards (popular searches/trending datasets) when scrolled intp
  function useGrowOnScroll(length: number) {
    const [visible, setVisible] = useState<boolean[]>(() =>
      Array(length).fill(false)
    );
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = Number(entry.target.getAttribute("data-index"));
            if (entry.isIntersecting) {
              setVisible((prev) => {
                const copy = [...prev];
                copy[index] = true;
                return copy;
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      refs.current.forEach((el) => {
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }, [length]);

    return { visible, refs };
  }

  const {
    visible: popularSearchesVisible,
    refs: popularRefs
  } = useGrowOnScroll(popularSearches.length);

  const {
    visible: trendingVisible,
    refs: trendingRefs
  } = useGrowOnScroll(trendingDataSets.length);

  //@todo: Add actual download links and desired popular searches
  return (
    <div>
      <Box
        width="100%"
        height={"auto"}
        paddingY={{xs: 10, md: 20}}
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
          backgroundAttachment: 'fixed'
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
        {/* <Box
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
        <Collapse in={multipleRegionSearchVisible} sx={{ width: "100%" }} timeout={500}>
          <MultipleRegionSearch assembly={assembly} toggleMultipleRegionSearchVisible={toggleMultipleRegionSearchVisible} />
        </Collapse> */}
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
          Browse these example searches to get started with SCREEN. You can search for genes, cCREs, variants, a specific loci, or a study from the GWAS catalog. 
          Change the assembly above to see different examples.
        </Typography>
        <Grid container spacing={5} justifyContent="flex-start" marginTop={6} width={"100%"}>
          {popularSearches.map((entity, index) => (
            <Grow
              in={popularSearchesVisible[index]}
              timeout={800 + index * 300}
              key={`${assembly}-${entity.name}-${index}`}
            >
              <Grid
                ref={(el) => { popularRefs.current[index] = el }}
                data-index={index}
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
                  href={ entity.entity === "GWAS" ? 
                    `/GRCh38/gwas/Dastani_Z-22479202-Adiponectin_levels` :
                    `/${assembly}/${entity.entity.toLowerCase()}/${entity.name}`
                  }
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Grid>
            </Grow>
          ))}
        </Grid>
      </Box>
      <Box width={"100%"} justifyContent={"center"} alignItems={"center"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}>
        <Grid
          container
          width="100%"
          justifyContent="space-around"
        >
          <Grid size={6} width={"auto"}>
            <Typography variant="h4" sx={{ fontWeight: 550, mb: 2 }}>
              Access SCREEN Data Instantly!
            </Typography>
            <Typography variant="body1" maxWidth={500}>
              Download comprehensive datasets of candidate cis-Regulatory Elements (cCREs) from ENCODE for in-depth analysis.
            </Typography>
          </Grid>
          <Grid size={6} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }} width={"auto"}>
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
          </Grid>
        </Grid>
      </Box>
      <Box width={"100%"} justifyContent={"flex-start"} display={"flex"} flexDirection={"column"} sx={{ paddingY: 10, paddingX: { xs: 5, md: 20 } }}>
        <Typography variant="h6" sx={{ fontWeight: 550 }}>📈 Trending Datasets</Typography>
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
                  LinkComponent={Link}
                  href={data.link}
                >
                  <DownloadIcon />
                </IconButton>
              </Grid>
            </Grow>
          ))}
        </Grid>
      </Box>
    </div>
  );
}