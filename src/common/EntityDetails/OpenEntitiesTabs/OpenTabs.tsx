import * as React from 'react'
import { Box, Divider } from "@mui/material";
import { OpenEntity } from "./OpenEntitiesContext";
import { DraggableTab } from "./DraggableTab";
import { Droppable } from "@hello-pangea/dnd";
import HumanIcon from "app/_utility/humanIcon";
import MouseIcon from "app/_utility/mouseIcon";

interface OpenTabsProps {
  openEntities: OpenEntity[];
  currentEntityState: OpenEntity;
  handleCloseTab: (entity: OpenEntity) => void;
  handleTabClick: (entity: OpenEntity) => void;
  multipleAssembliesOpen: boolean;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box p={1} display={"flex"} alignItems={"center"}>
    {children}
  </Box>
);

const HumanTabGroupIcon = () => (
  <IconWrapper>
    <HumanIcon size={25} />
  </IconWrapper>
);

const MouseTabGroupIcon = () => (
  <IconWrapper>
    <MouseIcon size={25} />
  </IconWrapper>
);

interface DroppableSectionProps {
  droppableId: string;
  type?: string;
  entities: OpenEntity[];
  currentEntityState: OpenEntity;
  sharedTabProps: {
    handleCloseTab: (entity: OpenEntity) => void;
    handleTabClick: (entity: OpenEntity) => void;
    closable: boolean;
  };
}

/**
 * A reusable component for rendering a droppable section of tabs
 */
const DroppableSection: React.FC<DroppableSectionProps> = ({
  droppableId,
  type,
  entities,
  currentEntityState,
  sharedTabProps,
}) => (
  <Droppable droppableId={droppableId} type={type} direction="horizontal">
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex" }}>
        {entities.map((entity, i) => (
          <DraggableTab
            key={i}
            index={i}
            entity={entity}
            isSelected={currentEntityState?.entityID === entity.entityID}
            {...sharedTabProps}
          />
        ))}
        <div style={{ visibility: "hidden" }}>{provided.placeholder}</div>
      </div>
    )}
  </Droppable>
);

/**
 * Note: needed to set display: flex on the Droppable div to fix positioning issues with
 * the placeholder element. The other fix would be to set vertical-align: middle
 * on the placeholder directly. Also, need to wrap the placeholder and make it invisible to
 * fix default styles it was inheriting from being a <button>
 */
export const OpenTabs: React.FC<OpenTabsProps> = ({
  openEntities,
  currentEntityState,
  handleCloseTab,
  handleTabClick,
  multipleAssembliesOpen,
}) => {
  const sharedTabProps = {
    handleCloseTab,
    handleTabClick,
    closable: openEntities.length > 1,
  };

  if (multipleAssembliesOpen) {
    const firstAssembly = openEntities[0].assembly;
    const secondAssembly = firstAssembly === "GRCh38" ? "mm10" : "GRCh38";
    return (
      <>
        {firstAssembly == "GRCh38" ? <HumanTabGroupIcon /> : <MouseTabGroupIcon />}
        <DroppableSection
          droppableId="droppable-human"
          type="human"
          entities={openEntities.filter((x) => x.assembly === firstAssembly)}
          currentEntityState={currentEntityState}
          sharedTabProps={sharedTabProps}
        />
        <Divider flexItem orientation="vertical" sx={{ marginY: 1 }} />
        {secondAssembly == "mm10" ? <MouseTabGroupIcon /> : <HumanTabGroupIcon />}
        <DroppableSection
          droppableId="droppable-mouse"
          type="mouse"
          entities={openEntities.filter((x) => x.assembly === secondAssembly)}
          currentEntityState={currentEntityState}
          sharedTabProps={sharedTabProps}
        />
      </>
    );
  }
  
  return (
    <DroppableSection
      droppableId="droppable"
      entities={openEntities}
      currentEntityState={currentEntityState}
      sharedTabProps={sharedTabProps}
    />
  );
};
