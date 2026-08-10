import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Divider, Stack, Tooltip, Typography } from "@mui/material";

function DownloadContentLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Stack gap={1} display={"flex"} flexDirection={"column"} width={"100%"} flexGrow={1}>
      <Stack direction="row" alignItems="center" gap={0.75}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {description && (
          <Tooltip title={description} placement="right-start" arrow>
            <InfoOutlinedIcon fontSize="small" />
          </Tooltip>
        )}
      </Stack>
      <Divider />
      {children}
    </Stack>
  );
}

export default DownloadContentLayout;
