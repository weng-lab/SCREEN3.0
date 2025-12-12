import { Button, Stack, Typography } from "@mui/material";
import { Assembly } from "common/types/globalTypes";
import Image from "next/image";

type BiosampleLandingHeaderProps = {
  assembly: Assembly;
};

const BiosampleLandingHeader = ({ assembly }: BiosampleLandingHeaderProps) => {
  const link = `https://www.encodeproject.org/reference-epigenome-matrix/?type=Experiment&control_type!=*&related_series.@type=ReferenceEpigenome&status=released&replicates.library.biosample.donor.organism.scientific_name=${assembly === "GRCh38" ? "Homo+sapiens" : "Mus+musculus"}`;
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
          <strong>Explore Biosample Data</strong>
        </Typography>
        <Typography variant="body1">
          Visualize and explore {assembly === "GRCh38" ? "human" : "mouse"} biosamples across diverse tissues and cell
          types from ENCODE
        </Typography>
      </Stack>
      <Button
        variant="contained"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ width: "240px", height: 60, backgroundColor: "white" }}
      >
        <Image style={{ objectFit: "contain" }} src={"/encode-logo-small-2x.png"} fill alt="genecard-snpcard-button" />
      </Button>
    </Stack>
  );
};

export default BiosampleLandingHeader;
