"use client";
import { Box, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function MaintenanceBanner() {
  return (
    <Stack
      direction={"row"}
      style={{
        width: "100%",
        height: "40px",
        backgroundColor: "#ff9800",
        color: "#fff",
        textAlign: "center",
      }}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={2}
    >
      <WarningAmberIcon />
      <Typography sx={{ fontWeight: "bold" }}>
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          SCREEN API is temporarily unavailable. We are working to resolve the issue and will be back shortly.
        </Box>
        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
          SCREEN API temporarily unavailable.
        </Box>
      </Typography>
      <WarningAmberIcon />
    </Stack>
  );
}
