import { Typography } from "@mui/material";
import LegacyVersionsTable from "common/components/LegacyVersionsTable";
import { LinkComponent } from "common/components/LinkComponent";
import { RELEASE_NOTES } from "../versions/releaseNotes";
import { AboutSection } from "./AboutSection";

export default function SiteVersions() {
  return (
    <>
      <AboutSection title={`Current Site Version: ${RELEASE_NOTES[0]?.version ?? ""}`}>
        <LinkComponent href="/about/versions">View release history</LinkComponent>
      </AboutSection>
      <AboutSection id="versions" title="Legacy Releases">
        <Typography variant="body1">
          Earlier versions of SCREEN remain available for reference and reproducibility but are no longer actively
          updated. Users should be aware that data, annotations, and features in legacy releases may differ from the
          current release.
        </Typography>
        <LegacyVersionsTable />
      </AboutSection>
    </>
  );
}
