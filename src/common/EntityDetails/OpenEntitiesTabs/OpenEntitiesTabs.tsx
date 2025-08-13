import { Add } from "@mui/icons-material";
import { Stack, Paper, Tooltip, Divider, Tab, Box } from "@mui/material";
import { OpenEntity, OpenEntitiesContext, OpenEntityState } from "./OpenEntitiesContext";
import { compressOpenEntitiesToURL, decompressOpenEntitiesFromURL, parseGenomicRangeString } from "common/utility";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Assembly, EntityType, TabRoute } from "types/globalTypes";
import { DragDropContext, Droppable, OnDragEndResponder } from "@hello-pangea/dnd";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OpenEntitiesTabsMenu from "./OpenEntitiesTabsMenu";
import { useMenuControl } from "common/MenuContext";
import { DraggableTab } from "./DraggableTab";
import HumanIcon from "app/_utility/humanIcon";
import MouseIcon from "app/_utility/mouseIcon";

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
  const urlEntityType = pathname.split("/")[2] as EntityType;
  const urlEntityID = pathname.split("/")[3];
  const urlTab = (pathname.split("/")[4] ?? "") as TabRoute;
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
      console.log("called with " + url);
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

  const handleCloseAll = useCallback(
    openEntities.length > 1
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
    openEntities.length > 1
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

  /**
   * Index of current route's element within internal state
   */
  const tabIndex = useMemo(() => {
    const i = openEntities.findIndex((el) => el.entityID === urlEntityID);
    if (i === -1) {
      return 0; //Fix MUI invalid tab error. Return 0 on initial load when usePathname (thus urlEntityID) hasn't resolved
    } else return i;
  }, [openEntities, urlEntityID]);

  const multipleAssembliesOpen = useMemo(() => {
    const assemblies = openEntities.map((x) => x.assembly);
    return assemblies.includes("GRCh38") && assemblies.includes("mm10");
  }, [openEntities]);

  const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box p={1} display={"flex"} alignItems={"center"}>
      {children}
    </Box>
  );

  const HumanTabGroupIcon = useCallback(
    () => (
      <IconWrapper>
        <HumanIcon size={25} />
      </IconWrapper>
    ),
    []
  );
  const MouseTabGroupIcon = useCallback(
    () => (
      <IconWrapper>
        <MouseIcon size={25} />
      </IconWrapper>
    ),
    []
  );

  const OpenTabs = useCallback(() => {
    const border: boolean = false;
    const sharedTabProps = {
      handleCloseTab: handleCloseTab,
      handleTabClick: handleTabClick,
      closable: openEntities.length > 1,
    };
    if (multipleAssembliesOpen) {
      const firstAssembly = openEntities[0].assembly;
      const secondAssembly = firstAssembly === "GRCh38" ? "mm10" : "GRCh38";
      return (
        <>
          {firstAssembly == "GRCh38" ? <HumanTabGroupIcon /> : <MouseTabGroupIcon />}
          <Droppable droppableId="droppable-human" type="human" direction="horizontal">
            {(provided, snapshot) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={border ? { border: "1px solid red" } : {}}
                >
                  {openEntities
                    .filter((x) => x.assembly === firstAssembly)
                    .map((entity, i) => (
                      <DraggableTab
                        key={i}
                        index={i}
                        entity={entity}
                        isSelected={currentEntityState?.entityID === entity.entityID}
                        {...sharedTabProps}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
          <Divider flexItem orientation="vertical" sx={{ marginY: 1 }} />
          {secondAssembly == "mm10" ? <MouseTabGroupIcon /> : <HumanTabGroupIcon />}
          <Droppable droppableId="droppable-mouse" type="mouse" direction="horizontal">
            {(provided, snapshot) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={border ? { border: "1px solid red" } : {}}
                >
                  {openEntities
                    .filter((x) => x.assembly === secondAssembly)
                    .map((entity, i) => (
                      <DraggableTab
                        key={i}
                        index={i}
                        entity={entity}
                        isSelected={currentEntityState?.entityID === entity.entityID}
                        {...sharedTabProps}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </>
      );
    } else
      return (
        //Create one shared droppable area
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {openEntities.map((entity, i) => (
                  <DraggableTab
                    key={i}
                    index={i}
                    entity={entity}
                    isSelected={currentEntityState?.entityID === entity.entityID}
                    {...sharedTabProps}
                  />
                ))}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      );
  }, [
    HumanTabGroupIcon,
    MouseTabGroupIcon,
    currentEntityState?.entityID,
    handleCloseTab,
    handleTabClick,
    multipleAssembliesOpen,
    openEntities,
  ]);

  return (
    <TabContext value={tabIndex}>
      {/* z index of scrollbar in DataGrid is 60 */}
      <Paper elevation={1} square sx={{ position: "sticky", top: 0, zIndex: 61 }} id="open-elements-tabs">
        <Stack direction={"row"}>
          <DragDropContext onDragEnd={onDragEnd}>
            <TabList
              variant="scrollable"
              allowScrollButtonsMobile
              scrollButtons={"auto"}
              sx={{
                "& .MuiTabs-scrollButtons.Mui-disabled": {
                  opacity: 0.3,
                },
                "& .MuiTabs-indicator": {
                  display: "none", // hide selected indicator since we're adding one back in to fix drag behavior
                },
                "& .MuiTabs-flexContainer": {
                  alignItems: "center"
                },
                flexGrow: 1,
              }}
            >
              <OpenTabs />
              <Tooltip title="New Search" placement="right">
                <Tab onClick={handleFocusSearch} icon={<Add fontSize="small" />} sx={{ minWidth: 0 }} />
              </Tooltip>
            </TabList>
          </DragDropContext>
          <OpenEntitiesTabsMenu handleCloseAll={handleCloseAll} handleSort={handleSort} />
        </Stack>
      </Paper>
      {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */}
      <TabPanel value={tabIndex} sx={{ p: 0, flexGrow: 1, minHeight: 0 }} id="element-details-TabPanel">
        {children}
      </TabPanel>
    </TabContext>
  );
};
