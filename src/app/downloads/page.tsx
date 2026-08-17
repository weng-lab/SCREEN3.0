"use client";

import * as React from "react";
import { Tabs, Tab, Divider, Box, Typography } from "@mui/material";
import { DataMatrices } from "./_DataMatrices/DataMatrices";
import { useState } from "react";
import { DownloadRange } from "./_DownloadRange/DownloadRange";
import Annotations from "./_Annotations/Annotations";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Downloads() {
  const [page, setPage] = useState(0);

  const handleChange = (_, newValue: number) => {
    setPage(newValue);
  };

  return (
    <Box
      display={"grid"}
      gridTemplateRows={"auto 1fr"}
      height={"100%"}
      boxSizing={"border-box"}
      sx={{ p: 2 }}
      gap={2}
      id="downloads"
    >
      {/*
        The page leads straight into the tabs, so there is no visible heading to promote. This
        gives screen readers and crawlers the main heading the page otherwise lacks, without
        changing the layout. Standard clip-rect pattern -- display:none would hide it from both.
      */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Download cCRE Data
      </Typography>
      <Box id="downloads-tabs" minWidth={0}>
        <Tabs
          value={page}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-scrollButtons.Mui-disabled": {
              opacity: 0.3,
            },
          }}
        >
          <Tab label="Annotations" {...a11yProps(0)} />
          <Tab label="Data Matrices" {...a11yProps(1)} />
          <Tab label="Download cCREs in Genomic Region" {...a11yProps(2)} />
        </Tabs>
        <Divider />
      </Box>
      <Box minWidth={0} minHeight={0} id="downloads-content">
        {page === 0 && <Annotations />}
        {page === 1 && <DataMatrices />}
        {page === 2 && <DownloadRange />}
      </Box>
    </Box>
  );
}
