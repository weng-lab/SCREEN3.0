'use client'

import { Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GeneDetailsTab, GenomicElementType, IcreDetailsTab, RegionDetailsTab, VariantDetailsTab } from "types/globalTypes";
import { geneDetailsTabs, icreDetailsTabs, regionDetailsTabs, sharedTabs, variantDetailsTabs } from "./tabsConfig";
import Image from "next/image";

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
  elementID: string
  orientation: "horizontal" | "vertical"
  verticalTabsWidth?: number
}

const ElementDetailsTabs = ({ elementType, elementID, orientation, verticalTabsWidth }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1) === elementID ? "" : pathname.substring(pathname.lastIndexOf('/') + 1)
  
  const [value, setValue] = React.useState(currentTab);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //If we ever use parallel routes to nest multiple elements in the same view, this will probably break
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  const tabs: ElementDetailsTab[] = useMemo(() => {
    let elementSpecificTabs: VariantDetailsTab[] | GeneDetailsTab[] | IcreDetailsTab[] | RegionDetailsTab[];
    switch (elementType) {
      case ("gene"):
        elementSpecificTabs = geneDetailsTabs
        break
      case ("variant"):
        elementSpecificTabs = variantDetailsTabs
        break
      case ("icre"):
        elementSpecificTabs = icreDetailsTabs
        break
      case ("region"):
        elementSpecificTabs = regionDetailsTabs
    }
    return [
      ...elementSpecificTabs,
      ...sharedTabs,
    ]
  }, [elementType])

  const horizontalTabs = orientation === "horizontal"
  const verticalTabs = orientation === "vertical"

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="Tabs"
      orientation={orientation}
      allowScrollButtonsMobile
      variant="scrollable"
      scrollButtons={horizontalTabs ? true : false}
      sx={{
        "& .MuiTab-root": {
          "&.Mui-selected": {
            backgroundColor: "rgba(73, 77, 107, .15)",
          },
        },
        "& .MuiTabs-scrollButtons.Mui-disabled": {
          opacity: 0.3,
        },
        width: verticalTabs ? verticalTabsWidth : "initial",
        height: '100%',
        backgroundColor: verticalTabs && '#F2F2F2',
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          label={tab.label}
          value={tab.href}
          LinkComponent={Link}
          href={`/${elementType}/${elementID}/${tab.href}` + '?' + searchParams.toString()}
          key={tab.href}
          icon={<Image width={verticalTabs ? 50 : 40} height={verticalTabs ? 50 : 40} src={tab.iconPath} alt={tab.label + " icon"} />}
        />
      ))}
    </Tabs>
  );
}

export default ElementDetailsTabs