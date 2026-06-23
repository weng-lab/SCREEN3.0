import { Alert } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";

export const CitationInfoAlert = () => (
  <Alert severity="info" sx={{ alignSelf: "flex-start" }} variant="outlined">
    Heatmaps are from{" "}
    <LinkComponent href="https://www.nature.com/articles/s41586-025-09909-9" openInNewTab showExternalIcon>
      Moore...Weng (2026) <i>Nature</i>
    </LinkComponent>
    . Phylogenetic tree and multiple sequence alignments are based on data from{" "}
    <LinkComponent href="https://doi.org/10.1126/science.abn7930" openInNewTab showExternalIcon>
      Andrews ... Weng (2023) <i>Science</i>
    </LinkComponent>
    . In addition to human, the dataset includes 240 placental mammalian species. Each species is represented by one
    genome, except for domestic dog, which is represented by two genomes: one outbred and one purebred.
  </Alert>
);