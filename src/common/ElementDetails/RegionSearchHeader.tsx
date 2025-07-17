import { Button, Typography } from "@mui/material";
import { GenomicRange } from "types/globalTypes";
import Image from "next/image";
import Grid2 from "@mui/material/Grid2";

export type RegionSearchHeaderProps = {
  region: GenomicRange;
};

const RegionSearchHeader = ({ region }: RegionSearchHeaderProps) => {
  return (
    <Grid2
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid2 size={{ xs: 12, sm: 9 }}>
        <Typography variant="subtitle1">Region Search</Typography>
        <Typography variant="h4">{region.chromosome}:{region.start.toLocaleString()}-{region.end.toLocaleString()}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 3 }}>
        <Grid2 container direction="column" spacing={1} sx={{ height: "100%" }} textAlign={"right"}>
          <Grid2 container spacing={1} sx={{ flexGrow: 1 }} order={{ xs: 2, sm: 1 }} justifyContent={"flex-end"}>
            <Grid2
              size={{ xs: 12 }}
              sx={{ display: "flex" }}
              height={{ xs: 65, sm: "auto" }}
            >
              <Button
                variant="contained"
                href={`http://screen.wenglab.org/search/?q=${region.chromosome}:${region.start}-${region.end}&uuid=0&assembly=GRCh38`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: "100%", height: "100%", backgroundColor: "white" }}
              >
                <Image
                  style={{ objectFit: "contain", padding: 4 }}
                  src="/SCREEN-on-light@16x.png"
                  fill
                  alt="screen-card-button"
                />
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default RegionSearchHeader;
