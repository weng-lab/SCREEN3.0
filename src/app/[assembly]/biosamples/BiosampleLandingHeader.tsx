import { Button, Grid, Stack, Typography } from "@mui/material";
import { Assembly } from "common/types/globalTypes";
import Image from "next/image";

type BiosampleLandingHeaderProps = {
  assembly: Assembly;
};

const BiosampleLandingHeader = ({ assembly }: BiosampleLandingHeaderProps) => {
  const link = `https://www.encodeproject.org/reference-epigenome-matrix/?type=Experiment&control_type!=*&related_series.@type=ReferenceEpigenome&status=released&replicates.library.biosample.donor.organism.scientific_name=${assembly === "GRCh38" ? "Homo+sapiens" : "Mus+musculus"}`;
  return (
    <Grid
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="h4">
            <strong>Explore Biosample Data</strong>
          </Typography>
          <Typography variant="body1">
            Visualize and explore {assembly === "GRCh38" ? "human" : "mouse"} biosamples across diverse tissues and cell
            types from ENCODE
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 1.5 }} display={"flex"} height={{ xs: 60 }} justifyContent={"flex-end"} gap={1}>
        <Button
          variant="outlined"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            flex: 1,
            backgroundColor: "transparent",
            borderColor: "divider",
            "& img": { transition: "filter 0.2s ease" },
            "&:hover img": { filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" },
          }}
        >
          <Image
            style={{ objectFit: "contain" }}
            src={"/encode-logo-small-2x.png"}
            fill
            alt="genecard-snpcard-button"
          />
        </Button>
      </Grid>
    </Grid>
  );
};

export default BiosampleLandingHeader;
