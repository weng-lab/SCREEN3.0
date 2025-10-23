"use client";
import { Typography, Box, Grid, Link as MuiLink, Stack } from "@mui/material";
import Image from "next/image";
import { LinkComponent } from "./LinkComponent";

export default function Footer() {
  const sections = [
    {
      title: "About us",
      links: [
        { name: "SCREEN", href: "/about" },
        { name: "Weng Lab", href: "https://www.umassmed.edu/zlab/" },
        { name: "Moore Lab", href: "https://sites.google.com/view/moore-lab/" },
        { name: "ENCODE Consortium", href: "https://www.encodeproject.org/" },
        { name: "UMass Chan Medical School", href: "https://www.umassmed.edu/" },
      ],
    },
    {
      title: "Explore/Tools",
      links: [
        { name: "PsychSCREEN", href: "https://psychscreen.wenglab.org/psychscreen" },
        { name: "igSCREEN", href: "https://igscreen.vercel.app/" },
        { name: "Factorbook", href: "https://www.factorbook.org/" },
        // { name: "GWAS", href: "/gwas" },
        // { name: "ARGO", href: "/argo" },
      ],
    },
    {
      title: "Data",
      links: [
        { name: "Downloads", href: "/downloads" },
        { name: "Version History", href: "/version-history" },
      ],
    },
    {
      title: "Help",
      links: [
        { name: "API Documentation", href: "/about#api-documentation" },
        { name: "Citations", href: "/about#citations" },
        { name: "Contact Us/Feedback", href: "/about#contact-us" },
      ],
    },
  ];

  return (
    <Box
      id="Footer"
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: (theme) => theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.appBar,
        color: "#fff",
        paddingX: 6,
      }}
    >
      <Grid container spacing={6} my={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={1} alignItems="flex-start">
            <Image src={"/on-dark.svg"} alt="Logo" width={120} height={60} />
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              Search Candidate Regulatory Elements by ENCODE
            </Typography>
            <Typography variant="body2">
              Copyright ©{" "}
              <MuiLink color="inherit" href="https://www.umassmed.edu/zlab/">
                Weng Lab
              </MuiLink>
              ,{" "}
              <MuiLink color="inherit" href="https://sites.google.com/view/moore-lab/">
                Moore Lab
              </MuiLink>{" "}
              {new Date().getFullYear()}.
            </Typography>
            <Typography variant="body2" color={"#b2bcf0"}>
              How to Cite the ENCODE Encyclopedia, the Registry of cCREs, and SCREEN: <br />
              <MuiLink href="https://www.nature.com/articles/s41586-020-2493-4" color={"#b2bcf0"} underline="always">
                &quot;ENCODE Project Consortium, et al. Nature 2020.&quot;
              </MuiLink>
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={4}>
            {sections.map((section) => (
              <Grid size={{ xs: 6, sm: 3 }} key={section.title}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  {section.title}
                </Typography>
                <Stack spacing={0.5}>
                  {section.links.map((link) => (
                    <LinkComponent
                      href={link.href}
                      key={link.name}
                      underline="none"
                      color="inherit"
                      width={"fit-content"}
                      variant="subtitle2"
                    >
                      {link.name}
                    </LinkComponent>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
