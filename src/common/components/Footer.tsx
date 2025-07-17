"use client"
import { Typography, Box } from "@mui/material"
import MuiLink from "@mui/material/Link"

export default function Footer() {
  return (
    <Box
      id="Footer"
      sx={{
        textAlign: "center",
        width: "100%",
        backgroundColor: (theme) => theme.palette.primary.main,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Typography variant="body2" color="#ffffff">
        {"Copyright © "}
        <MuiLink color="inherit" href="https://www.umassmed.edu/zlab/">
          Weng Lab
        </MuiLink>
        {", "}
        <MuiLink color="inherit" href="https://www.moore-lab.org/">
          Moore Lab
        </MuiLink>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}
