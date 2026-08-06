import { useState } from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useApolloClient } from "@apollo/client/react";
import { Assembly, CcreClass } from "common/types/globalTypes";
import {
  Assays,
  Conservation,
  downloadBED,
  parseGenomicRegion,
} from "app/downloads/_DownloadRange/downloadRangeHelpers";

function CircularProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" value={value} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

type DownloadBedButtonProps = {
  assembly: Assembly;
  /** User-entered genomic region. The button is disabled while this can't be parsed */
  region: string;
  biosampleName?: string;
  assays: Assays;
  conservation: Conservation;
  classes: CcreClass[];
};

/**
 * Downloads the cCREs in the given region as a .bed file, showing fetch progress while it does.
 */
export const DownloadBedButton = ({
  assembly,
  region,
  biosampleName,
  assays,
  conservation,
  classes,
}: DownloadBedButtonProps) => {
  const client = useApolloClient();
  const [loadingPercent, setLoadingPercent] = useState<number>(null);

  const parsedRegion = parseGenomicRegion(region);

  const handleDownloadBed = () => {
    downloadBED({
      client,
      assembly,
      ...parsedRegion,
      biosampleName,
      assays,
      conservation,
      classes,
      setBedLoadingPercent: setLoadingPercent,
    });
  };

  return (
    <Stack direction="row" alignItems={"center"} sx={{ mt: 1 }}>
      <Button
        disabled={loadingPercent !== null || !parsedRegion || classes.length === 0}
        variant="outlined"
        sx={{ textTransform: "none" }}
        onClick={handleDownloadBed}
        endIcon={<Download />}
        fullWidth
      >
        Download Search Results (.bed)
      </Button>
      {loadingPercent !== null && <CircularProgressWithLabel value={loadingPercent} />}
    </Stack>
  );
};
