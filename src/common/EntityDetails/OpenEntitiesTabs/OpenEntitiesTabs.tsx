import { Add } from "@mui/icons-material";
import { Tab, Stack, Paper, Tooltip } from "@mui/material";
import { OpenEntity, OpenEntitiesContext } from "./OpenEntitiesContext";
import { compressOpenEntitiesToURL, decompressOpenEntitiesFromURL, parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { EntityType, TabRoute } from "types/globalTypes";
import { DragDropContext, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OpenEntitiesTabsMenu from "./OpenEntitiesTabsMenu";
import { useMenuControl } from "common/MenuContext";
import { DraggableTab } from "./DraggableTab";

export const constructEntityURL = (entity: OpenEntity) =>
  `/${entity.entityType}/${entity.entityID}/${entity.tab}`;

export const OpenEntityTabs = ({ children }: { children?: React.ReactNode }) => {
  const [openEntities, dispatch] = useContext(OpenEntitiesContext);
  const { menuCanBeOpened, isMenuMounted, openMenu } = useMenuControl();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Attributes of current entity
  const urlEntityType = pathname.split("/")[1] as EntityType;
  const urlEntityID = pathname.split("/")[2];
  const urlTab = (pathname.split("/")[3] ?? "") as TabRoute;
  const currentEntityState = openEntities.find((el) =>
    urlEntityType === "region" && el.entityType === "region"
      ? JSON.stringify(parseGenomicRangeString(el.entityID)) === JSON.stringify(parseGenomicRangeString(urlEntityID)) //handles "%3A"/":" discrepency in url
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
      console.log("called with " + url)
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
   * Important - this relies on openEntitiess being an empty array on initial load, and it never being reset to empty
   * Otherwise would need to check isInitializedRef.current
   */
  useEffect(() => {
    if (!openEntities.length || isRoutingRef.current) return;
    const newUrl = pathname + "?open=" + compressOpenEntitiesToURL(openEntities);
    router.push(newUrl);
  }, [openEntities, pathname, navigateAndMark, router]);

  /**
   * 
   */
  useEffect(() => {
    // if current route is not in open elements, and routing is not currently underway
    if (!isRoutingRef.current && !currentEntityState) {
      dispatch({
        type: "addEntity",
        entity: {
          entityID: urlEntityID,
          entityType: urlEntityType,
          tab: urlTab,
        },
      });
    }
  }, [currentEntityState, dispatch, urlEntityID, urlEntityType, urlTab]);

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
        const needToNavigate = elToClose.entityID === urlEntityID;
        if (needToNavigate) {
          const toCloseIndex = openEntities.findIndex((openEl) => openEl.entityID === elToClose.entityID);

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
    [openEntities, urlEntityID, dispatch, navigateAndMark]
  );

  //  ------- End <DraggableTab> Helpers -------

  //  ------- <OpenEntitiesTabsMenu> Helpers -------

  const moreThanOneEntityOpen = useMemo(() => {
    if (openEntities.length > 1) {
      return true;
    } else return false;
  }, [openEntities]);

  const handleCloseAll = useCallback(
    moreThanOneEntityOpen
      ? () => {
          dispatch({
            type: "setState",
            state: [currentEntityState],
          });
        }
      : undefined, // fallback to undefined and menu will disable the option
    [currentEntityState, dispatch]
  );

  const handleSort = useCallback(
    moreThanOneEntityOpen
      ? () => {
          const sortOrder: EntityType[] = ["region", "gene", "ccre", "variant"];
          dispatch({
            type: "setState",
            state: [...openEntities].sort((a, b) => {
              const typeComparison = sortOrder.indexOf(a.entityType) - sortOrder.indexOf(b.entityType);
              if (typeComparison === 0) {
                return a.entityID.localeCompare(b.entityID);
              }
              return typeComparison;
            }),
          });
        }
      : undefined, // fallback to undefined and menu will disable the option
    [dispatch, openEntities]
  );

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

  return (
    /**
     * @todo I think this defeats the purpose of using TabContext and TabPanel if we are dynamically switching the content of TabPanel
     * https://mui.com/material-ui/react-tabs/#experimental-api
     */
    <TabContext value={1}>
      {/* z index of scrollbar in DataGrid is 60 */}
      <Paper elevation={1} square sx={{ position: "sticky", top: 0, zIndex: 61 }} id="open-elements-tabs">
        <Stack direction={"row"}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => {
                return (
                  <TabList
                    ref={provided.innerRef} //need to expose highest DOM node to the Droppable component
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons={snapshot.draggingFromThisWith ? false : "auto"} //prevent scroll buttons from appearing when dragging first or last item
                    sx={{
                      "& .MuiTabs-scrollButtons.Mui-disabled": {
                        opacity: 0.3,
                      },
                      "& .MuiTabs-indicator": {
                        display: "none", // hide selected indicator since we're adding one back in to fix drag behavior
                      },
                      flexGrow: 1,
                    }}
                    {...provided.droppableProps} //contains attributes for styling and element lookups
                  >
                    {openEntities.map((entity, i) => (
                      <DraggableTab
                        key={i}
                        index={i}
                        closable={moreThanOneEntityOpen}
                        entity={entity}
                        isSelected={currentEntityState?.entityID === entity.entityID}
                        handleCloseTab={handleCloseTab}
                        handleTabClick={handleTabClick}
                      />
                    ))}
                    {!snapshot.draggingFromThisWith && (
                      <Tooltip title="New Search" placement="right">
                        <Tab onClick={handleFocusSearch} icon={<Add fontSize="small" />} sx={{ minWidth: 0 }} />
                      </Tooltip>
                    )}
                    {/* Currently not using placeholder element, but could do so with the below */}
                    {/* {provided.placeholder} */}
                  </TabList>
                );
              }}
            </Droppable>
          </DragDropContext>
          <OpenEntitiesTabsMenu handleCloseAll={handleCloseAll} handleSort={handleSort} />
        </Stack>
      </Paper>
      {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */}
      <TabPanel value={1} sx={{ p: 0, flexGrow: 1, minHeight: 0 }} id="element-details-TabPanel">
        {children}
      </TabPanel>
    </TabContext>
  );
};
