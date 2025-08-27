import { Add } from "@mui/icons-material";
import { Stack, Paper, Tooltip, IconButton, Box } from "@mui/material";
import { OpenEntity, OpenEntitiesContext } from "./OpenEntitiesContext";
import { compressOpenEntitiesToURL, decompressOpenEntitiesFromURL, parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Assembly, EntityType } from "types/globalTypes";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import OpenEntitiesTabsMenu from "./OpenEntitiesTabsMenu";
import { useMenuControl } from "common/MenuContext";
import { OpenTabs } from "./OpenEntitiesTabs";

/**
 * @todo before going on, make sure that this file checks to make sure that the route is valid before adding it into state
 */

export const constructEntityURL = (entity: OpenEntity) =>
  `/${entity.assembly}/${entity.entityType}/${entity.entityID}/${entity.tab}`;

export const OpenEntityTabs = ({ children }: { children?: React.ReactNode }) => {
  const [openEntities, dispatch] = useContext(OpenEntitiesContext);
  const { menuCanBeOpened, isMenuMounted, openMenu } = useMenuControl();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Attributes of current entity
  const urlAssembly = pathname.split("/")[1] as Assembly;
  const urlEntityType = pathname.split("/")[2] as EntityType<typeof urlAssembly>;
  const urlEntityID = pathname.split("/")[3];
  const urlTab = (pathname.split("/")[4] ?? "")
  const currentEntityState = openEntities.find((el) =>
    urlEntityType === "region" && el.entityType === "region"
      ? JSON.stringify(parseGenomicRangeString(el.entityID)) === JSON.stringify(parseGenomicRangeString(urlEntityID)) &&
        el.assembly === urlAssembly
      : el.entityID === urlEntityID
  );

  // ------- Initialize state from URL on initial load -------

  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      const openParam = searchParams.get("open");
      if (openParam) {
        const openEntitiesFromUrl: OpenEntity[] = decompressOpenEntitiesFromURL(openParam);
        if (openEntitiesFromUrl.length > 0) {
          dispatch({ type: "setState", state: openEntitiesFromUrl });
        }
      }
      isInitializedRef.current = true;
    }
  }, [dispatch, searchParams]);

  // ------- Routing Related --------

  const isRoutingRef = useRef(false); // used to prevent race conditions when updating internal state and url (both async)

  /**
   * Navigates to given url, marking isRoutingRef to true
   * Needed to prevent race conditions between async state and routing changes
   */
  const navigateAndMark = useCallback(
    (url: string) => {
      isRoutingRef.current = true;
      router.push(url);
    },
    [router]
  );

  /**
   * Reset the routing flag when routing is complete
   */
  useEffect(() => {
    isRoutingRef.current = false;
  }, [urlEntityID]);

  /**
   * Sync URL with current internal state (skip if not initialized yet)
   * Important - this relies on openEntities being an empty array on initial load, and it never being reset to empty
   * Otherwise would need to check isInitializedRef.current
   */
  useEffect(() => {
    if (!openEntities.length || isRoutingRef.current) return;
    const newUrl = pathname + "?open=" + compressOpenEntitiesToURL(openEntities);
    router.replace(newUrl); //don't use navigateAndMark since it's only set to false when navigating between elements (would be stuck false)
  }, [navigateAndMark, openEntities, pathname, router]);

  /**
   *
   */
  useEffect(() => {
    // if current route is not in open elements, and routing is not currently underway
    if (!isRoutingRef.current && !currentEntityState) {
      dispatch({
        type: "addEntity",
        entity: {
          assembly: urlAssembly,
          entityID: urlEntityID,
          entityType: urlEntityType,
          tab: urlTab,
        },
      });
    }
  }, [currentEntityState, dispatch, urlAssembly, urlEntityID, urlEntityType, urlTab]);

  //sync the current view to the state
  useEffect(() => {
    if (!isRoutingRef.current && currentEntityState && urlTab !== currentEntityState.tab) {
      dispatch({
        type: "updateEntity",
        entity: {
          ...currentEntityState,
          tab: urlTab,
        },
      });
    }
  }, [urlTab, currentEntityState, dispatch]);

  /**
   * Called when Drag ends within <DragDropContext>. Dispatches reorder event
   */
  const onDragEnd: OnDragEndResponder<string> = (result, provided) => {
    if (result.destination.index !== result.source.index) {
      dispatch({
        type: "reorder",
        entity: openEntities.find((el) => el.entityID === result.draggableId),
        startIndex: result.source.index,
        endIndex: result.destination.index,
      });
    }
  };

  // ------- <DraggableTab> Helpers -------

  const handleTabClick = useCallback(
    (elToOpen: OpenEntity) => {
      navigateAndMark(constructEntityURL(elToOpen) + "?" + searchParams.toString());
    },
    [navigateAndMark, searchParams]
  );

  const handleCloseTab = useCallback(
    (elToClose: OpenEntity) => {
      if (openEntities.length > 1) {
        // only need to navigate if you're closing the tab that you're on
        const needToNavigate = elToClose.entityID === urlEntityID && elToClose.assembly === urlAssembly;
        if (needToNavigate) {
          const toCloseIndex = openEntities.findIndex((openEl) => openEl.entityID === elToClose.entityID && elToClose.assembly === urlAssembly);

          //if elToClose is last tab, go to the tab on left. Else, go to the tab on the right
          const elToNavTo =
            toCloseIndex === openEntities.length - 1 ? openEntities[toCloseIndex - 1] : openEntities[toCloseIndex + 1];

          navigateAndMark(constructEntityURL(elToNavTo));
        }

        dispatch({
          type: "removeEntity",
          entity: elToClose,
        });
      }
    },
    [openEntities, urlEntityID, urlAssembly, dispatch, navigateAndMark]
  );

  //  ------- End <DraggableTab> Helpers -------

  //  ------- <OpenEntitiesTabsMenu> Helpers -------

  const handleCloseAll = useCallback(() => {
    dispatch({
      type: "setState",
      state: [currentEntityState],
    });
  }, [currentEntityState, dispatch]);

  const handleSort = useCallback(() => {
    dispatch({
      type: "sort",
    });
  }, [dispatch]);

  // ------- End <OpenEntitiesTabsMenu> Helpers -------

  //  ------- "New Search" Button Helpers -------

  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);

  useEffect(() => {
    if (isMenuMounted && shouldFocusSearch) {
      const el = document.getElementById("mobile-search-component");
      if (el) {
        el.focus();
        setShouldFocusSearch(false); // reset the flag
      }
    }
  }, [isMenuMounted, shouldFocusSearch]);

  const handleFocusSearch = useCallback(() => {
    if (menuCanBeOpened) {
      // aka isMobile
      openMenu();
      setShouldFocusSearch(true); // defer focusing until menu is open
    } else {
      document.getElementById("desktop-search-component")?.focus();
    }
  }, [menuCanBeOpened, openMenu]);

  // ------- End "New Search" Button Helpers -------

  /**
   * Index of current route's element within internal state
   */
  const tabIndex = useMemo(() => {
    const i = openEntities.findIndex((el) => el.entityID === urlEntityID && el.assembly === urlAssembly);
    if (i === -1) {
      return 0; //Fix MUI invalid tab error. Return 0 on initial load when usePathname (thus urlEntityID) hasn't resolved
    } else return i;
  }, [openEntities, urlAssembly, urlEntityID]);

  const openTabsProps = {
    openEntities,
    currentEntityState,
    handleCloseTab,
    handleTabClick,
  };

  return (
    <TabContext value={tabIndex}>
      {/* z index of scrollbar in DataGrid is 60 */}
      <Paper elevation={1} square sx={{ position: "sticky", top: 0, zIndex: 61 }} id="open-elements-tabs">
        <Stack direction={"row"}>
          <DragDropContext onDragEnd={onDragEnd}>
            <OpenTabs {...openTabsProps} />
          </DragDropContext>
          <Box sx={{ flexGrow: 1, justifyContent: "flex-start", alignContent: "center" }}>
            <Tooltip title="New Search" placement="right">
              <IconButton onClick={handleFocusSearch}>
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          {/* We need to handle the case where there is one open for each assembly, and sorting should be disabled. */}
          <OpenEntitiesTabsMenu
            handleCloseAll={handleCloseAll}
            disableCloseAll={openEntities.length === 1}
            handleSort={handleSort}
            disableSort={openEntities.length === 1}
          />
        </Stack>
      </Paper>
      {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */}
      <TabPanel value={tabIndex} sx={{ p: 0, flexGrow: 1, minHeight: 0 }} id="element-details-TabPanel">
        {children}
      </TabPanel>
    </TabContext>
  );
};
