"use client";
import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import HumanIcon from "common/components/HumanIcon";
import { Assembly } from "common/types/globalTypes";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import MouseIcon from "common/components/MouseIcon";
import { usePathname } from "next/navigation";
import BiosampleLandingHeader from "./BiosampleLandingHeader";
import HumanBodyMap from "./bodyMaps/human/HumanBodyMap";

export default function BiosampleLandingPage() {
  const pathname = usePathname();
  const assembly = pathname.split("/")[1];

  const [tab, setTab] = useState<Assembly>(assembly as Assembly);

  const handleChange = (_, newValue: Assembly) => {
    setTab(newValue);
  };

  const theme = useTheme();

  return (
    <Box sx={{ marginX: "5%", marginY: 2, height: "100%" }}>
      <BiosampleLandingHeader assembly={tab as Assembly} />
      <Tabs
        value={tab}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab
          value="GRCh38"
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <HumanIcon color={tab === "GRCh38" ? theme.palette.primary.main : "grey"} size={25} />
              <Typography>Human</Typography>
            </Stack>
          }
        />
        <Tab
          value="mm10"
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <MouseIcon color={tab === "mm10" ? theme.palette.primary.main : "grey"} size={25} />
              <Typography>Mouse</Typography>
            </Stack>
          }
        />
      </Tabs>
      <Divider />
      <HumanBodyMap />
    </Box>
  );
}
