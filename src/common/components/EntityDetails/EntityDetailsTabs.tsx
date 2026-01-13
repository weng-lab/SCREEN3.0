"use client";

import { Tabs, Tab, Menu, MenuItem, Tooltip, TabsOwnProps } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { Assembly } from "common/types/globalTypes";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { AnyEntityType, getTabsForEntity, TabConfig } from "common/entityTabsConfig";

// outside the component
function CloneProps(props) {
  const { children, ...other } = props;
  return children(other);
}

export type ElementDetailsTabsProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
  orientation: TabsOwnProps["orientation"];
};

const EntityDetailsTabs = ({ assembly, entityType, entityID, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // If the route ends with just /entityID (like ccre would), set tab value to empty string, else to end slug of URL
  const currentTab =
    pathname.substring(pathname.lastIndexOf("/") + 1) === entityID
      ? ""
      : pathname.substring(pathname.lastIndexOf("/") + 1);

  const [value, setValue] = React.useState(currentTab);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
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
      setValue(currentTab);
    }
  }, [currentTab, value]);

  const tabs = useMemo(() => getTabsForEntity(assembly, entityType), [assembly, entityType]);

  const verticalTabs = orientation === "vertical";

  const iconTabs = useMemo(() => tabs.filter((x) => x.iconPath), [tabs]);
  const moreTabs = useMemo(() => tabs.filter((x) => !x.iconPath), [tabs]);

  const [tabsDisabledInfo, setTabsDisabledInfo] = useState<{ route: string; isDisabled: boolean }[]>(null);

  useEffect(() => {
    async function getTabIsDisabled(tab: TabConfig<string>) {
      return await (tab.getIsDisabled ? tab.getIsDisabled(entityID) : false);
    }

    async function fetchTabInfo(tabs: readonly TabConfig<string>[]) {
      const info = await Promise.all(tabs.map((x) => getTabIsDisabled(x)));
      setTabsDisabledInfo(tabs.map((x, i) => ({ route: x.route, isDisabled: info[i] })));
    }

    if (tabsDisabledInfo === null) fetchTabInfo(tabs);
  }, [entityID, tabsDisabledInfo, tabs]);

  const tabVal = useMemo(() => (iconTabs.some((x) => x.route === value) ? value : "more"), [iconTabs, value]);

  return (
    <>
      <Tabs
        value={tabVal}
        onChange={handleChange}
        aria-label="Tabs"
        orientation={orientation}
        allowScrollButtonsMobile
        variant="scrollable"
        sx={{
          "& .MuiTab-root": {
            "&.Mui-selected": {
              backgroundColor: verticalTabs ? "rgba(73, 77, 107, .15)" : "initial",
            },
          },
          "& .MuiTabs-scrollButtons.Mui-disabled": {
            opacity: 0.3,
          },
          position: "sticky",
          top: "calc(var(--header-height, 64px) + var(--entity-tabs-height, 48px))",
          width: verticalTabs ? 100 : "100%",
          maxHeight: '100%'
        }}
      >
        {iconTabs.map((tab) => {
          const tabIsDisabled = tabsDisabledInfo?.find((x) => x.route === tab.route).isDisabled;
          const tooltipTitle = tabIsDisabled ? (tab.disabledMessage ?? "Not Available") : "";
          return (
            <CloneProps key={tab.route} value={tab.route}>
              {(tabProps) => (
                <Tooltip title={tooltipTitle} arrow>
                  <span>
                    <Tab
                      {...tabProps}
                      label={tab.label}
                      value={tab.route}
                      disabled={tabIsDisabled}
                      LinkComponent={Link}
                      href={`/${assembly}/${entityType}/${entityID}/${tab.route}?${searchParams.toString()}`}
                      key={tab.route}
                      icon={
                        <Image
                          width={verticalTabs ? 50 : 40}
                          height={verticalTabs ? 50 : 40}
                          src={tab.iconPath}
                          alt={tab.label + " icon"}
                          style={{
                            filter: tabIsDisabled ? "grayscale(100%) blur(1px)" : "none",
                          }}
                        />
                      }
                      sx={{ fontSize: "12px", width: "100%" }}
                    />
                  </span>
                </Tooltip>
              )}
            </CloneProps>
          );
        })}
        {moreTabs.length && (
          <Tab
            value="more"
            label={"More"}
            icon={<MoreHorizIcon />}
            onClick={handleMoreClick}
            sx={{ fontSize: "12px" }}
          />
        )}
      </Tabs>
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
            disabled={tabsDisabledInfo?.find((x) => x.route === tab.route).isDisabled}
          >
            {tab.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default EntityDetailsTabs;
