import { Alert } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";

const MohdInfoBanner = () => (
  <Alert variant="outlined" severity="info">
    The below pilot data comes from the MOHD consortium. For more information please visit{" "}
    <LinkComponent href={"https://www.mohdconsortium.org/home"} openInNewTab showExternalIcon>
      mohdconsortium.org
    </LinkComponent>{" "}
    and the{" "}
    <LinkComponent
      href={"https://www.genome.gov/research-funding/Funded-Programs-Projects/Multi-Omics-for-Health-and-Disease"}
      openInNewTab
      showExternalIcon
    >
      NHGRI Project Overview
    </LinkComponent>
  </Alert>
);

export default MohdInfoBanner;
