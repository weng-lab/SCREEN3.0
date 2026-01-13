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

    const footer = document.querySelector<HTMLElement>("footer");

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // entry.intersectionRatio provides the percentage visible (0.0 to 1.0)
          const visiblePercentage = Math.floor(entry.intersectionRatio * 100);
          console.log(`Element visibility: ${visiblePercentage}%`);

          // You can also get the visible height in pixels
          const visibleHeight = entry.intersectionRect.height;
          console.log(`Visible height: ${visibleHeight}px`);

        document.documentElement.style.setProperty("--footer-visible-height", `${visibleHeight}px`);
        });
      },
      {
        root: null, // Observes relative to the viewport
        rootMargin: "0px",
        threshold: buildThresholdList(), // Can be a single number or an array of thresholds
      }
    );

    function buildThresholdList() {
      const thresholds = [];
      for (let i = 0; i <= 1.0; i += 0.005) {
        thresholds.push(i);
      }
      return thresholds;
    }

    visibilityObserver.observe(footer);

    return () => {
      window.removeEventListener("resize", updateHeights);
      observer.disconnect();
    };
  }, []);
        {/* 
          Tabs `orientation` prop is not a ResponsiveStyleValue and would need to either measure using useMediaQuery (causes layout shift)
          or heavily override the flex/overflow properties of the Tabs component (kinda complex given its built in scrolling functionality).
          This was simplest way to prevent layout shift:
        */}
  return (
    // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenEntityTabs>
      <Box
        id="split-pane-container"
        display={"grid"}
        height={"100%"}
        gridTemplateColumns={{ xs: "minmax(0, 1fr)", md: "auto minmax(0, 1fr)" }}
      >
        <Box
          id="vertical-view-tabs-container"
          gridColumn={1}
          gridRow={1}
          bgcolor={"#F2F2F2"}
          position={"sticky"}
          top={"calc(var(--header-height, 64px) + var(--entity-tabs-height, 48px))"}
          maxHeight={
            "calc(100vh - var(--header-height, 64px) - var(--entity-tabs-height, 48px) - var(--footer-visible-height, 0px))"
          }
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
