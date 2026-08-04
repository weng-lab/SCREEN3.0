"use client";

import * as React from "react";
import { Tabs, Tab, Divider, Box } from "@mui/material";
import { DataMatrices } from "./_DataMatrices/DataMatricies";
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
