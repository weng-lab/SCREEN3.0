import * as React from "react";
import { AnyOpenEntity } from "./OpenEntitiesContext";
import { DraggableTab } from "./DraggableTab";
import { Droppable } from "@hello-pangea/dnd";
import { TabList } from "@mui/lab";

interface OpenTabsProps {
  openEntities: AnyOpenEntity[];
  currentEntityState: AnyOpenEntity;
  handleCloseTab: (entity: AnyOpenEntity) => void;
  handleTabClick: (entity: AnyOpenEntity) => void;
}

/**
 * This is used to prevent warnings about unrecognized properties
 * from MUI being injected onto the div wrapping the placeholder
 */
const RemoveMuiProps: React.FC<React.PropsWithChildren> = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export const OpenTabs: React.FC<OpenTabsProps> = ({
  openEntities,
  currentEntityState,
  handleCloseTab,
  handleTabClick,
}) => {
  const sharedTabProps = {
    handleCloseTab,
    handleTabClick,
    closable: openEntities.length > 1,
  };

  return (
    <Droppable droppableId={"droppableID"} direction="horizontal">
      {(provided, snapshot) => (
        <TabList
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
            "& .MuiTabs-flexContainer": {
              alignItems: "center",
            },
          }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {openEntities.map((entity, i) => (
            <DraggableTab
              key={i}
              index={i}
              entity={entity}
              isSelected={
                currentEntityState?.entityID === entity.entityID && currentEntityState?.assembly === entity.assembly
              }
              {...sharedTabProps}
            />
          ))}
          <RemoveMuiProps>
            <div style={{ visibility: "hidden" }}>{provided.placeholder}</div>
          </RemoveMuiProps>
        </TabList>
      )}
    </Droppable>
  );
};
