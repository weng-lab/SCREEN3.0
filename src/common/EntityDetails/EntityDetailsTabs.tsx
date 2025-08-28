'use client'

import { Tabs, Tab, Menu, MenuItem, Box } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Assembly } from "types/globalTypes";
import Image from "next/image";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { EntityType, getTabsForEntity } from "./entityTabsConfig";

export type ElementDetailsTabsProps<A extends Assembly> = {
  assembly: A
  entityType: EntityType<A>
  entityID: string
  orientation: "horizontal" | "vertical"
  verticalTabsWidth?: number
}

const EntityDetailsTabs = <A extends Assembly>({ assembly, entityType, entityID, orientation, verticalTabsWidth }: ElementDetailsTabsProps<A>) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1) === entityID ? "" : pathname.substring(pathname.lastIndexOf('/') + 1)

  const [value, setValue] = React.useState(currentTab);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //If we ever use parallel routes to nest multiple elements in the same view, this will probably break
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  const tabs = useMemo(() => getTabsForEntity(assembly, entityType), [assembly, entityType]);

  const horizontalTabs = orientation === "horizontal"
  const verticalTabs = orientation === "vertical"

  const iconTabs = tabs.filter(x => x.iconPath)
  const moreTabs = tabs.filter(x => !x.iconPath)

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
      {iconTabs.map((tab, index) => (
        <Tab
          label={tab.label}
          value={tab.route}
          LinkComponent={Link}
          href={`/${assembly}/${entityType}/${entityID}/${tab.route}` + '?' + searchParams.toString()}
          key={tab.route}
          icon={<Image width={verticalTabs ? 50 : 40} height={verticalTabs ? 50 : 40} src={tab.iconPath} alt={tab.label + " icon"} />}
          sx={{ fontSize: "12px" }}
        />
      ))}
      {moreTabs.length && (
        <Box>
          <Tab
            label={"More"}
            icon={<MoreHorizIcon />}
            onClick={handleMoreClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: verticalTabs ? "top" : "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {moreTabs.map((tab) => (
              <MenuItem
                key={tab.label}
                component={Link}
                href={`/${assembly}/${entityType}/${entityID}/${tab.route}?${searchParams.toString()}`}
                onClick={handleClose}
              >
                {tab.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Tabs>
  );
}

export default EntityDetailsTabs