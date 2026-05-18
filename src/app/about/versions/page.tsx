import { Box, Stack, Typography } from "@mui/material";
import LegacyVersionsModal from "./LegacyVersionsModal";
import VersionsLayout from "./VersionsLayout";

export const metadata = {
  title: "Release Notes | SCREEN",
  description: "Track SCREEN release notes, updates, and legacy versions.",
};

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
            <Typography variant="h4">Release Notes</Typography>
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
