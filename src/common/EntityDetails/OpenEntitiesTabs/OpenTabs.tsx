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

export const OpenTabs: React.FC<OpenTabsProps> = ({
  openEntities,
  currentEntityState,
  handleCloseTab,
  handleTabClick,
  multipleAssembliesOpen,
}) => {
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
            console.log("abcd")
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
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
        <Droppable droppableId="droppable-mouse" type="mouse" direction="horizontal" >
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
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
};
