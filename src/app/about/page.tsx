"use client";

import { Stack } from "@mui/material";
import AboutHeader from "./_Sections/AboutHeader";
import ApiDocumentation from "./_Sections/ApiDocumentation";
import CcreCollections from "./_Sections/CcreCollections";
import ContactUs from "./_Sections/ContactUs";
import EncodeEncyclopedia from "./_Sections/EncodeEncyclopedia";
import EncodeIntegration from "./_Sections/EncodeIntegration";
import HowToCite from "./_Sections/HowToCite";
import RegistryOfCcres from "./_Sections/RegistryOfCcres";
import SiteVersions from "./_Sections/SiteVersions";

export default function About() {
  return (
    <Stack
      component="main"
      spacing={4}
      sx={{ maxWidth: 1000, marginX: "auto", marginY: 6, paddingX: { xs: 2, md: 4 } }}
    >
      <AboutHeader />
      <EncodeEncyclopedia />
      <RegistryOfCcres />
      <CcreCollections />
      <EncodeIntegration />
      <HowToCite />
      <SiteVersions />
      <ApiDocumentation />
      <ContactUs />
    </Stack>
  );
}
