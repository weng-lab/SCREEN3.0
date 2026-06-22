"use client";
import React, { useState } from "react";
import { EntityViewComponentProps } from "common/entityTabsConfig";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled, Tab } from "@mui/material";
import { Box } from "@mui/system";
import ConservationAndOrthologTables from "./ConservationAndOrthologTables";
import SequenceCoverage from "./SequenceCoverage";
import { Heatmap } from "./Heatmap";

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
          {entity.assembly === "GRCh38" && <Tab label="Conservation Simplex" value={1} />}
          {entity.assembly === "GRCh38" && <Tab label="240 Mammal Alignment" value={2} />}
        </TabList>
      </Box>
      <StyledTabPanel value={0}>
        <ConservationAndOrthologTables entity={entity} />
      </StyledTabPanel>
      {entity.assembly === "GRCh38" && (
        <StyledTabPanel value={1}>
          <Heatmap entity={entity} />
        </StyledTabPanel>
      )}
      {entity.assembly === "GRCh38" && (
        <StyledTabPanel value={2} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SequenceCoverage entity={entity} />
        </StyledTabPanel>
      )}
    </TabContext>
  );
};
