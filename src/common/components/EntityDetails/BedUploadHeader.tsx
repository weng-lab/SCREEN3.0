import { Stack, Typography } from "@mui/material";

export type BedUploadHeaderProps = {
  fileName: string;
};

/**
 * @todo remove this component and make EntityDetailsHeader able to handle displaying the region search header
 */

const BedUploadHeader = ({ fileName }: BedUploadHeaderProps) => {
  return (
    <Stack
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      justifyContent={"space-between"}
    >
      <Typography variant="subtitle1">Bed Upload</Typography>
      <Typography variant="h4">{fileName}</Typography>
    </Stack>
  );
};

export default BedUploadHeader;
