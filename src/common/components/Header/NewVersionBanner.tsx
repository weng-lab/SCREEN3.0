"use client";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { LinkComponent } from "common/components/LinkComponent";

type NewVersionBannerProps = {
  versionId?: string;
  message?: string;
  href?: string;
};

const NewVersionBanner = ({
  versionId = "",
  message = "New release now available.",
}: NewVersionBannerProps) => {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: 35,
        maxHeight: 35,
        px: 5,
        bgcolor: "#3b407a",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto minmax(0, auto) auto",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 20,
            px: 1,
            borderRadius: 999,
            bgcolor: "primary.main",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption">NEW</Typography>
        </Box>
        <Typography
          variant="body2"
          noWrap
          sx={{ color: "#FFFFFF" }}
        >
          <b>{versionId}</b><Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>: {message}</Box>
        </Typography>
        <Typography variant="body2">
          <LinkComponent href={"/about/versions"} underline="hover" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
            <u>Details →</u>
          </LinkComponent>
        </Typography>
      </Box>
      <IconButton
        aria-label="Close new version banner"
        onClick={() => setOpen(false)}
        size="small"
        sx={{
          position: "absolute",
          right: 8,
          color: "#FFFFFF",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default NewVersionBanner;
