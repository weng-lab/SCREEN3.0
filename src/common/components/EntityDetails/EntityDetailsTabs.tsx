"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { TabsOwnProps } from "@mui/material";
import { Assembly } from "common/types/globalTypes";
import { AnyEntityType, getTabsForEntity, TabConfig } from "common/entityTabsConfig";
import { DetailsTabs } from "@weng-lab/ui-components";

export type ElementDetailsTabsProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
  orientation: TabsOwnProps["orientation"];
};

const EntityDetailsTabs = ({ assembly, entityType, entityID, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab =
    pathname.substring(pathname.lastIndexOf("/") + 1) === entityID
      ? ""
      : pathname.substring(pathname.lastIndexOf("/") + 1);

  // Local state so the clicked tab highlights immediately, before the route transition resolves
  const [value, setValue] = React.useState(currentTab);
  const [syncedTab, setSyncedTab] = React.useState(currentTab);

  // Re-sync when the route changes from outside this component (back/forward, links elsewhere on
  // the page). Adjusting during render rather than in an effect avoids rendering the stale tab first
  if (syncedTab !== currentTab) {
    setSyncedTab(currentTab);
    setValue(currentTab);
  }

  const tabs = useMemo(() => getTabsForEntity(assembly, entityType), [assembly, entityType]);

  const verticalTabs = orientation === "vertical";

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

  const tabItems = useMemo(
    () =>
      tabs.map((tab) => ({
        value: tab.route,
        label: tab.label,
        icon: tab.iconPath ?? undefined,
        href: `/${assembly}/${entityType}/${entityID}/${tab.route}?${searchParams.toString()}`,
        disabled: tabsDisabledInfo?.find((x) => x.route === tab.route)?.isDisabled,
        disabledMessage: tab.disabledMessage,
      })),
    [tabs, assembly, entityType, entityID, searchParams, tabsDisabledInfo]
  );

  return (
    <DetailsTabs
      tabs={tabItems}
      value={value}
      onChange={setValue}
      orientation={orientation}
      LinkComponent={Link}
      selectedBackgroundColor={"rgba(73, 77, 107, .15)"}
      iconWidth={verticalTabs ? 50 : 40}
      iconHeight={verticalTabs ? 50 : 40}
      sx={{
        position: "sticky",
        top: "calc(var(--header-height, 64px) + var(--entity-tabs-height, 48px))",
        width: verticalTabs ? 100 : "100%",
        maxHeight: "100%",
      }}
    />
  );
};

export default EntityDetailsTabs;
