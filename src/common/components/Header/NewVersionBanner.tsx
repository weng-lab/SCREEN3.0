"use client";
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Link, Typography } from "@mui/material";
import { useState } from "react";

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
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
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
        <Typography variant="body2" sx={{ color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis" }}>
          <b>{versionId}:</b> {message}{" "}
        </Typography>
        <Typography variant="body2">
          <Link href={"/about/versions"} underline="hover" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
            <u>Details →</u>
          </Link>
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
