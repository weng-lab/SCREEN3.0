import { Stack, Typography } from "@mui/material";

const GWASLandingHeader = () => {
  return (
    <Stack
      sx={{ p: 1, mb: 2 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      justifyContent={"space-between"}
      direction={"row"}
    >
      <Stack>
        <Typography variant="h4">
          <strong>Explore GWAS Data</strong>
        </Typography>
        <Typography variant="body1">Search studies by category</Typography>
      </Stack>
    </Stack>
  );
};

export default GWASLandingHeader;
