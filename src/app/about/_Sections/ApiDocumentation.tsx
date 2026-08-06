import { Typography } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { AboutSection } from "./AboutSection";

export default function ApiDocumentation() {
  return (
    <AboutSection id="api-documentation" title="API Documentation">
      <Typography variant="body1">
        All SCREEN data is publicly available for download{" "}
        <LinkComponent href="https://screen.wenglab.org/downloads" openInNewTab>
          here
        </LinkComponent>{" "}
        and can also be accessed through our API. We provide authorized access to the API, which requires an API key for
        programmatic use. Please sign in to the{" "}
        <LinkComponent href="https://console.wenglab.org/" showExternalIcon openInNewTab>
          API Console
        </LinkComponent>{" "}
        to generate your API key. API key generation and usage instructions are available in the{" "}
        <LinkComponent href="https://console.wenglab.org/docs/getting-started/auth" showExternalIcon openInNewTab>
          documentation
        </LinkComponent>
        .
      </Typography>
    </AboutSection>
  );
}
