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
import { useElementHeights } from "./useElementHeights";
import useScrollReset from "common/hooks/useScrollReset";

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

  useElementHeights();
  useScrollReset();

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
