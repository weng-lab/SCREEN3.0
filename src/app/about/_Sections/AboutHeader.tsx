import { Box, Divider, Stack, Typography } from "@mui/material";

export default function AboutHeader() {
  return (
    <Stack component="header" spacing={1}>
      <Box>
        <Typography variant="h2" fontWeight={500}>
          About SCREEN
        </Typography>
        <Divider />
      </Box>
      <Typography variant="body1">
        <b>SCREEN (Search Candidate Regulatory Elements by ENCODE)</b> is a web-based visualization and discovery
        platform for exploring the ENCODE Registry of cis-Regulatory Elements (cCREs) and other ENCODE Encyclopedia
        annotations. SCREEN enables users to query, visualize, and download regulatory annotations across hundreds of
        human and mouse cell and tissue types and to examine their relationships to genes, transcription factor binding,
        chromatin state, and three-dimensional genome organization.
      </Typography>
    </Stack>
  );
}
