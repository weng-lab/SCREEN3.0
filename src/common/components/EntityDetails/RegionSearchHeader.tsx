import { Stack, Typography, Button } from "@mui/material";
import { formatGenomicRange } from "common/utility";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { expandCoordinates } from "../GenomeBrowser/utils";

export type RegionSearchHeaderProps = {
  region: GenomicRange;
  assembly: Assembly;
};

/**
 * @todo remove this component and make EntityDetailsHeader able to handle displaying the region search header
 */

const RegionSearchHeader = ({ assembly, region }: RegionSearchHeaderProps) => {
  const assemblyDb = assembly === "mm10" ? "mm10" : "hg38";
  const ucscTrack = assembly === "mm10" ? "encodeCcreCombined" : "cCREs";
  const coordinatesGenomeBrowser = formatGenomicRange(expandCoordinates(region, "region"))
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
        <Stack
          sx={{ p: 1 }}
          border={(theme) => `1px solid ${theme.palette.divider}`}
          borderRadius={1}
          justifyContent={"space-between"}
        >
          <Typography variant="subtitle1">Region Search</Typography>
          <Typography variant="h4">{formatGenomicRange(region)}</Typography>
        </Stack>
      </Grid>
      <Grid
        size={{ xs: 12, sm: 3 }}
        display={"flex"}
        height={{ xs: 60 }}
        justifyContent={"flex-end"}

      >
           <Button
                  variant="contained"
                  href={
                    //https://users.wenglab.org/niship/ucsc_gb_icon.png
                    coordinatesGenomeBrowser
                      ? `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=${assemblyDb}&g=${ucscTrack}&position=${coordinatesGenomeBrowser}`
                      //: `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=hg38&g=cCREs&position=chr19:50,417,519-50,417,853`
                      : `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=${assemblyDb}&g=${ucscTrack}&position=default`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ width: "48%", height: "100%", backgroundColor: "white" }}
                >
                  <Image
                    style={{ objectFit: "contain" }}
                    src={"https://genome.ucsc.edu/images/ucscHelixLogo.png"}
                    fill
                    unoptimized
                    alt="ucsc-gb-icon"
                  />
        
                  Open in UCSC
                </Button>

      </Grid>
    </Grid>
  );
};

export default RegionSearchHeader;
