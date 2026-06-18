import { Alert } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";

export const CitationInfoAlert = () => (
  <Alert severity="info" sx={{alignSelf: "flex-start"}} variant="outlined">
    Heatmaps are from{" "}
    <LinkComponent href="https://www.nature.com/articles/s41586-025-09909-9" openInNewTab showExternalIcon>
      Moore...Weng (2026) <i>Nature</i>
    </LinkComponent>
    . Multi sequence alignment data is from{" "}
    <LinkComponent href="https://doi.org/10.1126/science.abn7930" openInNewTab showExternalIcon>
      Andrews ... Weng <i>Science</i>
    </LinkComponent>
    , see {" "}
    <LinkComponent href={"https://zoonomiaproject.org/"} openInNewTab showExternalIcon>
      https://zoonomiaproject.org/
    </LinkComponent>
    {" "}for more info. Please note that MSA processing difference produces a small subset of cCREs with minor N1/N2 discrepancies between views.
  </Alert>
);