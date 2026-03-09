"use client";
import React, { useState } from "react";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled, Tab } from "@mui/material";
import { Box } from "@mui/system";
import ConservationAndOrthologTables from "./ConservationAndOrthologTables";
import SequenceCoverage from "./SequenceCoverage";

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,
}));

export const Conservation = ({ entity }: EntityViewComponentProps) => {
  const [tab, setTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Overview" value={0} />
          <Tab label="Coverage across 241 Mammals" value={1} />
        </TabList>
      </Box>
      <StyledTabPanel value={0}>
        <ConservationAndOrthologTables entity={entity} />
      </StyledTabPanel>
      <StyledTabPanel value={1} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SequenceCoverage entity={entity} />
      </StyledTabPanel>
    </TabContext>
  );
};
