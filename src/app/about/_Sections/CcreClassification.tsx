import { Stack, Typography } from "@mui/material";
import { CA_CTCF, CA_H3K4me3, CA_TF, CA_only, PLS, TF_only, dELS } from "common/ccre";
import Image from "next/image";
import classifications from "public/assets/about/images/classifications.png";
import { AboutSubsection } from "./AboutSection";

const CCRE_CLASSES: { color: string; label: string; description: string }[] = [
  {
    color: PLS,
    label: "Promoter-like",
    description:
      "Elements located near annotated or experimentally derived TSSs with high chromatin accessibility and H3K4me3 signal.",
  },
  {
    color: dELS,
    label: "Enhancer-like",
    description:
      "Accessible elements with high H3K27ac signal, subdivided into TSS-proximal and TSS-distal enhancers based on distance to the nearest TSS.",
  },
  {
    color: CA_H3K4me3,
    label: "Chromatin accessibility + H3K4me3 (CA–H3K4me3)",
    description: "Accessible elements with H3K4me3 but lacking strong H3K27ac and located away from TSSs.",
  },
  {
    color: CA_CTCF,
    label: "Chromatin accessibility + CTCF (CA–CTCF)",
    description: "Accessible elements with strong CTCF binding and low histone acetylation.",
  },
  {
    color: CA_TF,
    label: "Chromatin accessibility + transcription factor (CA–TF)",
    description:
      "Accessible elements overlapping transcription factor clusters but lacking strong histone modification signals.",
  },
  {
    color: CA_only,
    label: "Chromatin accessibility (CA)",
    description: "Accessible elements lacking strong H3K4me3, H3K27ac, or CTCF signals.",
  },
  {
    color: TF_only,
    label: "Transcription factor (TF)",
    description:
      "Elements defined by transcription factor binding in the absence of detectable chromatin accessibility or histone modification signals.",
  },
];

export default function CcreClassification() {
  return (
    <AboutSubsection id="classifications" title="Cell Type-Agnostic Classification of cCREs">
      <Typography variant="body1">
        Each cCRE is assigned a cell type-agnostic class based on its dominant biochemical signatures across all
        surveyed biosamples and its proximity to annotated transcription start sites (TSSs). This classification is
        intended to be analogous to gene catalogs, which define genes independently of their expression levels in
        individual cell types.
      </Typography>
      <Image src={classifications} alt="Classification of cCREs" style={{ width: "100%", height: "auto" }} />
      <Typography variant="body1">The major cCRE classes include:</Typography>
      <Stack spacing={1}>
        {CCRE_CLASSES.map(({ color, label, description }) => (
          <Typography key={label} variant="body1" paddingLeft="1rem" borderLeft={`0.25rem solid ${color}`}>
            <b>{label}</b> cCREs: {description}
          </Typography>
        ))}
      </Stack>
      <Typography variant="body1">
        All signal values used for classification are retained and made available in SCREEN to support custom filtering
        and user-defined analyses.
      </Typography>
    </AboutSubsection>
  );
}
