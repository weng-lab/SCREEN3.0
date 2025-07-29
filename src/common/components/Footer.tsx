"use client";
import { Typography, Box, Grid2, Link as MuiLink, Stack, Divider } from "@mui/material";
import Image from "next/image";

export default function Footer() {
  //TODO add links to the sections
  const sections = [
    {
      title: "About us",
      links: ["SCREEN", "Weng Lab", "Moore Lab", "ENCODE Consortium", "UMass Chan Medical School"],
    },
    {
      title: "Explore/Tools",
      links: ["Search cCREs", "Gene Expression", "GWAS", "ARGO"],
    },
    {
      title: "Data",
      links: ["Downloads", "Version History"],
    },
    {
      title: "Help",
      links: ["FAQs", "API Documentation", "Citations", "Contact Us/Feedback"],
    },
  ]
  return (
    <Box
      id="Footer"
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: (theme) => theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.appBar,
        color: "#fff",
        px: { xs: 4, md: 10 },
        py: { xs: 6, md: 8 },
      }}
    >
      <Grid2 container spacing={6}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Image src={"/on-dark.svg"} alt="Logo" width={120} height={60} />
            <Typography variant="body1" sx={{ mt: 2, textAlign: "left" }}>
              Search Candidate Regulatory Elements by ENCODE
            </Typography>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Grid2 container spacing={4}>
            {sections.map((section) => (
              <Grid2 size={{ xs: 6, sm: 3 }} key={section.title}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {section.title}
                </Typography>
                <Stack spacing={0.5}>
                  {section.links.map((link) => (
                    <MuiLink href="#" key={link} underline="none" color="inherit">
                      {link}
                    </MuiLink>
                  ))}
                </Stack>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>
      <Typography variant="body2" sx={{ mt: 6, mb: 2 }} textAlign={"center"} color={"#b2bcf0"}>
        How to Cite the ENCODE Encyclopedia, the Registry of cCREs, and SCREEN: <br />
        <MuiLink
          href="https://www.nature.com/articles/s41586-020-2493-4"
          color={"#b2bcf0"}
          underline="always"
        >
          &quot;ENCODE Project Consortium, et al. Nature 2020.&quot;
        </MuiLink>
      </Typography>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 3 }} />
      <Grid2
        container
        justifyContent="space-between"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
      >
        <Grid2>
          <Typography variant="body2">
            Copyright ©{" "}
            <MuiLink color="inherit" href="https://www.umassmed.edu/zlab/">
              Weng Lab
            </MuiLink>
            ,{" "}
            <MuiLink color="inherit" href="https://www.moore-lab.org/">
              Moore Lab
            </MuiLink>{" "}
            {new Date().getFullYear()}.
          </Typography>
        </Grid2>
        <Grid2>
          <Box display="flex" gap={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
            <MuiLink href="#" color="inherit" underline="hover">
              Privacy & Policy
            </MuiLink>
            <MuiLink href="#" color="inherit" underline="hover">
              Terms & Condition
            </MuiLink>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}