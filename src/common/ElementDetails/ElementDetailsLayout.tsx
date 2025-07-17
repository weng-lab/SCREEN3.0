"use client";
import { Box, Stack } from "@mui/material";
import ElementDetailsTabs from "./ElementDetailsTabs";
import ElementDetailsHeader, { ElementDetailsHeaderProps } from "./ElementDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenElementsTabs } from "./OpenElementsTabs/OpenElementsTabs";

export type ElementDetailsLayoutProps = ElementDetailsHeaderProps & { children: React.ReactNode };

export default function ElementDetailsLayout({ elementID, elementType, children }: ElementDetailsLayoutProps) {
  const verticalTabsWidth = 90
  
  return (
    // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenElementsTabs>
      {/* Everything below the open elements tabs */}
      <Stack direction={"row"} id="element-details-wrapper">
        {/* View tabs, shown only on desktop */}
        <Box sx={{ display: { xs: "none", md: "initial", height: "100%" } }} id="element-details-desktop-tabs">
          <Box sx={{ position: "fixed", height: "100%" }}>
            <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="vertical" verticalTabsWidth={verticalTabsWidth} />
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
          {elementType === "region" ? (
            <RegionSearchHeader region={parseGenomicRangeString(elementID)} />
          ) : (
            <ElementDetailsHeader elementType={elementType} elementID={elementID} />
          )}
          {/* View tabs, shown only on mobile */}
          <Box
            sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: "divider" }}
            id="element-details-desktop-tabs"
          >
            <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="horizontal" />
          </Box>
          {children}
        </Stack>
      </Stack>
    </OpenElementsTabs>
  );
}
