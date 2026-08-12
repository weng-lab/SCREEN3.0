import { Box, Stack, Typography } from "@mui/material";
import { pageMetadata } from "common/seo";
import LegacyVersionsModal from "./LegacyVersionsModal";
import VersionsLayout from "./VersionsLayout";

/** Overrides the /about metadata inherited from the parent layout. */
export const metadata = pageMetadata({
  title: "Release Notes",
  description:
    "Release notes for SCREEN: what's new, improved, and updated in each version of the site and the ENCODE Registry of candidate cis-regulatory elements.",
  path: "/about/versions",
});

export default function VersionHistory() {
  return (
    <>
      <Box
        px={6}
        py={3}
        sx={{
          borderBottom: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h4" component="h1">
              Release Notes
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Track what&apos;s new, improved, and updated across each release.
            </Typography>
          </Box>
          <LegacyVersionsModal />
        </Stack>
      </Box>
      <VersionsLayout />
    </>
  );
}
