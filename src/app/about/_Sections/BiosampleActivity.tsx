import { Typography } from "@mui/material";
import { AboutSubsection } from "./AboutSection";

export default function BiosampleActivity() {
  return (
    <AboutSubsection title="Biosample-Specific Activity Annotations">
      <Typography variant="body1">
        In addition to cell type–agnostic classes, SCREEN annotates the <b>biosample-specific activity</b> of each cCRE
        using the corresponding epigenomic data from individual biosamples. In this context, cCREs may be annotated as
        active promoters, enhancers, or other classes in some biosamples and inactive in others, reflecting cell
        type–specific regulatory programs.
      </Typography>
      <Typography variant="body1">
        Elements lacking sufficient chromatin accessibility signal in a given biosample are labeled as having low
        chromatin accessibility in that context.
      </Typography>
    </AboutSubsection>
  );
}
