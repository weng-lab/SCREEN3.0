import { Stack } from "@mui/material";
import { pageMetadata } from "common/seo";
import AboutHeader from "./_Sections/AboutHeader";
import ApiDocumentation from "./_Sections/ApiDocumentation";
import CcreCollections from "./_Sections/CcreCollections";
import ContactUs from "./_Sections/ContactUs";
import EncodeEncyclopedia from "./_Sections/EncodeEncyclopedia";
import EncodeIntegration from "./_Sections/EncodeIntegration";
import HowToCite from "./_Sections/HowToCite";
import RegistryOfCcres from "./_Sections/RegistryOfCcres";
import SiteVersions from "./_Sections/SiteVersions";

/**
 * This is a server component: every section here is static composition, and the only
 * interactive one (ContactForm) declares its own "use client". MUI ships client boundaries on
 * its own components, so <Stack> and friends need nothing from this file.
 *
 * Keep it that way -- adding a hook here pulls the whole section tree back into the client
 * bundle and makes this metadata export illegal.
 */
export const metadata = pageMetadata({
  title: "About the ENCODE Registry of cCREs",
  description:
    "How SCREEN and the ENCODE Registry of candidate cis-regulatory elements are built: cCRE classifications and collections, ENCODE integration, API access, and how to cite the resource.",
  path: "/about",
});

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
