"use client";
import { Box, Divider, Stack } from "@mui/material";
import EntityDetailsTabs from "./EntityDetailsTabs";
import { EntityDetailsHeader } from "./EntityDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenEntityTabs } from "./OpenEntitiesTabs/OpenEntitiesTabBar";
import { Assembly } from "common/types/globalTypes";
import { AnyEntityType } from "../../entityTabsConfig";
import { GwasStudyHeader } from "./GwasStudyHeader";
import BedUploadHeader from "./BedUploadHeader";
import { useEffect, } from "react";

export type EntityDetailsLayoutProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
} & { children: React.ReactNode };

const EntityHeader = ({
  entityType,
  entityID,
  assembly,
}: {
  entityType: AnyEntityType;
  entityID: string;
  assembly: Assembly;
}) => {
  switch (entityType) {
    case "region":
      return <RegionSearchHeader region={parseGenomicRangeString(entityID)} />;
    case "gwas":
      return <GwasStudyHeader assembly={assembly} entityType={entityType} entityID={entityID} />;
    case "bed":
      return <BedUploadHeader fileName={entityID} />;
    default:
      return <EntityDetailsHeader assembly={assembly} entityType={entityType} entityID={entityID} />;
  }
};

export default function EntityDetailsLayout({ assembly, entityID, entityType, children }: EntityDetailsLayoutProps) {

  // We need to measure the heights of the header and entity tabs to give both tabs components the correct top property
  useEffect(() => {
    const updateHeights = () => {
      const header = document.querySelector<HTMLElement>("header"); //AppBar component renders a header component
      const entityTabs = document.querySelector<HTMLElement>("#entity-tabs"); //Entity tabs given this id

      if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
      }

      if (entityTabs) {
        const entityTabsHeight = entityTabs.offsetHeight;
        document.documentElement.style.setProperty("--entity-tabs-height", `${entityTabsHeight}px`);
      }
    };

    // Initial measurement
    updateHeights();

    // Update on window resize
    window.addEventListener("resize", updateHeights);

    // Observe elements for size changes
    const header = document.querySelector<HTMLElement>("header");
    const entityTabs = document.querySelector<HTMLElement>(".entity-tabs");

    const observer = new ResizeObserver(updateHeights);

    if (header) observer.observe(header);
    if (entityTabs) observer.observe(entityTabs);

    return () => {
      window.removeEventListener("resize", updateHeights);
      observer.disconnect();
    };
  }, []);

  return (
    // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenEntityTabs>
      <Box
        id="split-pane-container"
        display={"grid"}
        height={"100%"}
        gridTemplateColumns={{ xs: "minmax(0, 1fr)", md: "auto minmax(0, 1fr)" }}
      >
        {/* 
          Adds shading to vertical tabs. Need to do this outside of the tabs since we need the intrinsic size 
          of the tabs to not stretch to the footer, but the background color needs to stretch all the way.
        */}
        <Box
          id="view-tabs-background"
          gridColumn={1}
          gridRow={1}
          bgcolor={"#F2F2F2"}
          display={{ xs: "none", md: "block" }}
        />
        {/* 
          Tabs `orientation` prop is not a ResponsiveStyleValue and would need to either measure using useMediaQuery (causes layout shift)
          or heavily override the flex/overflow properties of the Tabs component (kinda complex given its built in scrolling functionality).
          This was simplest way to prevent layout shift:
        */}
        <Box
          id="vertical-view-tabs-container"
          gridColumn={1}
          gridRow={1}
          position={"sticky"}
          top={"calc(var(--header-height, 64px) + var(--entity-tabs-height, 48px))"}
          maxHeight={"calc(100vh - var(--header-height, 64px) - var(--entity-tabs-height, 48px))"}
          display={{ xs: "none", md: "block" }}
        >
          <EntityDetailsTabs assembly={assembly} entityType={entityType} entityID={entityID} orientation="vertical" />
        </Box>
        <Stack id="main-content" spacing={2} m={2} gridColumn={{ xs: 1, md: 2 }} gridRow={{ xs: 2, md: 1 }}>
          <EntityHeader entityID={entityID} entityType={entityType} assembly={assembly} />
          <Box id="horizonatal-view-tabs-container" display={{ xs: "block", md: "none" }}>
            <EntityDetailsTabs
              assembly={assembly}
              entityType={entityType}
              entityID={entityID}
              orientation="horizontal"
            />
            <Divider />
          </Box>
          {children}
        </Stack>
      </Box>
    </OpenEntityTabs>
  );
}
