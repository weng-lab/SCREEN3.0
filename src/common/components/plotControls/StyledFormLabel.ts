import { FormLabel, styled } from "@mui/material";

/** Control label sized to match body text, shared by the assay, gene and transcript plot controls */
export const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  ...theme.typography.body2,
}));
