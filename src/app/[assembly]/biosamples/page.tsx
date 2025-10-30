"use client";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import HumanIcon from "common/components/HumanIcon";
import { Assembly } from "common/types/globalTypes";
import { useTheme } from "@mui/material/styles";
import MouseIcon from "common/components/MouseIcon";
import { usePathname } from "next/navigation";
import BiosampleLandingHeader from "./BiosampleLandingHeader";
import Human from "./HumanBiosamples";
import Mouse from "./MouseBiosamples";
import Link from "next/link";

export default function BiosampleLandingPage() {
  const pathname = usePathname();
  const assembly = pathname.split("/")[1];
  const theme = useTheme();

  return (
    <Box sx={{ marginX: "5%", marginY: 2, height: "100%" }}>
      <BiosampleLandingHeader assembly={assembly as Assembly} />
      <Tabs value={assembly} aria-label="basic tabs example" variant="scrollable" allowScrollButtonsMobile>
        <Tab
          value="GRCh38"
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <HumanIcon color={assembly === "GRCh38" ? theme.palette.primary.main : "grey"} size={25} />
              <Typography>Human</Typography>
            </Stack>
          }
          component={Link}
          href="/GRCh38/biosamples"
        />
        <Tab
          value="mm10"
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <MouseIcon color={assembly === "mm10" ? theme.palette.primary.main : "grey"} size={25} />
              <Typography>Mouse</Typography>
            </Stack>
          }
          component={Link}
          href="/mm10/biosamples"
        />
      </Tabs>
      <Divider />
      {assembly === "mm10" ? <Mouse /> : <Human />}
    </Box>
  );
}
