import { Typography } from "@mui/material";
import { AboutSection } from "./AboutSection";

export default function EncodeIntegration() {
  return (
    <AboutSection title="Integration with Other ENCODE Annotations">
      <Typography variant="body1">
        SCREEN integrates cCREs with a wide range of additional ENCODE Encyclopedia annotations. For each cCRE, users
        can explore overlapping transcription factor binding sites, histone modification peaks, chromatin state
        segmentations, transcription start sites, three-dimensional chromatin interactions, and gene expression
        measurements. These integrations support multi-layered analyses of regulatory mechanisms.
      </Typography>
    </AboutSection>
  );
}
