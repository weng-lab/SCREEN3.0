"use client";
import { Box, Stack } from "@mui/material";
import EntityDetailsTabs from "./EntityDetailsTabs";
import { EntityDetailsHeader } from "./EntityDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenEntityTabs } from "./OpenEntitiesTabs/OpenEntitiesTabBar";
import { Assembly } from "common/types/globalTypes";
import { AnyEntityType } from "../../entityTabsConfig";
import { GwasStudyHeader } from "./GwasStudyHeader";

export type EntityDetailsLayoutProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
} & { children: React.ReactNode };

export default function EntityDetailsLayout({ assembly, entityID, entityType, children }: EntityDetailsLayoutProps) {
  const verticalTabsWidth = 100;

  return (
    // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenEntityTabs>
      {/* Everything below the open elements tabs */}
      <Stack direction={"row"} id="element-details-wrapper" height={"100%"}>
        {/* View tabs, shown only on desktop */}
        <Box sx={{ display: { xs: "none", md: "initial", height: "100%" } }} id="element-details-desktop-tabs">
          <Box sx={{ position: "fixed", height: "100%" }}>
            <EntityDetailsTabs
              assembly={assembly}
              entityType={entityType}
              entityID={entityID}
              orientation="vertical"
              verticalTabsWidth={verticalTabsWidth}
            />
          </Box>
          {/* Needed to bump over the rest of the content since above is using position="fixed" */}
          <div style={{ width: verticalTabsWidth }} />
        </Box>
        <Stack
          width={"100%"}
          height={"100%"}
          overflow={"auto"}
          // minWidth of 0 needed to properly constrain children when resizing
          minWidth={0}
          boxSizing={"border-box"}
          spacing={2}
          p={2}
          id="element-details-main-content"
        >
          {entityType === "region" ? (
            <RegionSearchHeader region={parseGenomicRangeString(entityID)} />
          ) : entityType === "gwas" ? (
            <GwasStudyHeader assembly={assembly} entityType={entityType} entityID={entityID} />
          ) : (
            <EntityDetailsHeader assembly={assembly} entityType={entityType} entityID={entityID} />
          )}
          {/* View tabs, shown only on mobile */}
          <Box
            sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: "divider" }}
            id="element-details-desktop-tabs"
          >
            <EntityDetailsTabs
              assembly={assembly}
              entityType={entityType}
              entityID={entityID}
              orientation="horizontal"
            />
          </Box>
          {children}
        </Stack>
      </Stack>
    </OpenEntityTabs>
  );
}
