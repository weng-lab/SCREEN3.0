import { Stack, Typography } from "@mui/material";
import { formatGenomicRange } from "common/utility";
import { GenomicRange } from "types/globalTypes";

export type RegionSearchHeaderProps = {
  region: GenomicRange;
};

/**
 * @todo remove this component and make EntityDetailsHeader able to handle displaying the region search header
 */

const RegionSearchHeader = ({ region }: RegionSearchHeaderProps) => {
  return (
    <Stack
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      justifyContent={"space-between"}
    >
      <Typography variant="subtitle1">Region Search</Typography>
      <Typography variant="h4">
        {formatGenomicRange(region)}
      </Typography>
    </Stack>
  );
};

export default RegionSearchHeader;
