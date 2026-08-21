import { Typography } from "@mui/material";
import { AboutSection, Bullet, BulletList } from "./AboutSection";

export default function CcreCollections() {
  return (
    <AboutSection title="Core, Partial, and Ancillary Collections">
      <Typography variant="body1">
        Because the availability of epigenomic assays varies across biosamples, SCREEN organizes biosample-specific
        annotations into three collections:
      </Typography>
      <BulletList>
        <Bullet>
          <b>Core Collection</b>: Biosamples with chromatin accessibility, H3K4me3, H3K27ac, and CTCF data. These
          provide the most complete and highest-confidence cCRE annotations and are recommended for most analyses.
        </Bullet>
        <Bullet>
          <b>Partial Data Collection</b>: Biosamples with chromatin accessibility and a subset of additional marks.
          These samples enable high-resolution boundary definition but support a reduced set of cCRE classes.
        </Bullet>
        <Bullet>
          <b>Ancillary Collection</b>: Biosamples lacking chromatin accessibility data. In these cases, cCREs are
          annotated only by the presence or absence of high signal for available assays, and users are advised to anchor
          analyses on cCREs defined in the Core or Partial collections.
        </Bullet>
      </BulletList>
      <Typography variant="body1">
        SCREEN clearly labels biosamples by collection to guide appropriate interpretation.
      </Typography>
    </AboutSection>
  );
}
