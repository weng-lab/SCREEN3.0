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

  useEffect(() => {
    const updateHeights = () => {
      const header = document.querySelector<HTMLElement>("header");
      const entityTabs = document.querySelector<HTMLElement>(".entity-tabs");

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
        gridTemplateColumns={{ xs: "minmax(0, 1fr)", md: "auto minmax(0, 1fr)" }}
        gridTemplateRows={{ xs: "auto minmax(0, 1fr)", md: "auto" }}
      >
        <div id="view-tabs-background" style={{ gridColumn: 1, gridRow: 1, backgroundColor: "#F2F2F2" }} />
        <EntityDetailsTabs assembly={assembly} entityType={entityType} entityID={entityID} />
        <Stack id="main-content" spacing={2} m={2} gridColumn={ {xs: 1, md: 2}} gridRow={{xs: 2, md: 1}}>
          <EntityHeader entityID={entityID} entityType={entityType} assembly={assembly} />
          {children}
        </Stack>
      </Box>
    </OpenEntityTabs>
  );
}
