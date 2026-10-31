"use client";

import * as React from "react";
import { Tab, Divider, Box, Typography } from "@mui/material";
import { ScrollableTabs } from "@weng-lab/ui-components";
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
        // In px: sx reads a bare 1 as 100% and -1 as a spacing unit, which ran the heading 8px past the page's edge.
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Download cCRE Data
      </Typography>
      <Box id="downloads-tabs" minWidth={0}>
        <ScrollableTabs value={page} onChange={handleChange} aria-label="Downloads">
          <Tab label="Annotations" {...a11yProps(0)} />
          <Tab label="Data Matrices" {...a11yProps(1)} />
          <Tab label="Download cCREs in Genomic Region" {...a11yProps(2)} />
        </ScrollableTabs>
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
