import { Button, Grid, Stack, Typography } from "@mui/material";

const GWASLandingHeader = ({ activeCategory, backToGWASHome }) => {
  return (
    <Grid
      sx={{ p: 1, mb: 2 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      alignItems="center"
      justifyContent={"space-between"}
      container
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="h4">
            <strong>Explore GWAS Data</strong>
          </Typography>
          <Typography variant="body1">Search studies by category</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }} display="flex" justifyContent="flex-end">
        {/* Back button */}
        {activeCategory && (
          <Button
            //sx={{ mb: 2 }}
            onClick={backToGWASHome}
          >
            ← Back to GWAS Home Page
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default GWASLandingHeader;
