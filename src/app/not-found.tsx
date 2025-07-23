import { Typography, Box, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h1" component="h1" sx={{ fontSize: "4rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: "500px" }}>
        Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved, deleted, or the
        URL might be incorrect.
      </Typography>
      <Button component={Link} href="/" variant="contained" size="large" sx={{ mt: 2 }}>
        Return Home
      </Button>
    </Box>
  );
}
