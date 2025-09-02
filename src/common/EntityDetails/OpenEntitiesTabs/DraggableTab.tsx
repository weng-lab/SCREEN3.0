import { Draggable } from "@hello-pangea/dnd";
import { Close } from "@mui/icons-material";
import { styled, SxProps, Tab, TabProps, Theme } from "@mui/material";
import { AnyOpenEntity, OpenEntitiesContext, OpenEntity } from "./OpenEntitiesContext";
import { parseGenomicRangeString } from "common/utility";
import { useCallback, useContext, useMemo, useState } from "react";
import HumanIcon from 'app/_utility/humanIcon';
import MouseIcon from 'app/_utility/mouseIcon';
import { theme } from "app/theme";

export type DraggableTabProps = TabProps & {
  entity: AnyOpenEntity;
  index: number;
  closable: boolean;
  isSelected: boolean;
  handleTabClick: (el: AnyOpenEntity) => void;
  handleCloseTab: (el: AnyOpenEntity) => void;
};

export const DraggableTab = ({
  entity,
  index,
  closable,
  isSelected,
  handleTabClick,
  handleCloseTab,
  ...props
}: DraggableTabProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [openEntities] = useContext(OpenEntitiesContext);

  const multipleAssembliesOpen = useMemo(() => {
    const assemblies = openEntities.map((x) => x.assembly);
    return assemblies.includes("GRCh38") && assemblies.includes("mm10");
  }, [openEntities]);

  const Icon = useCallback(() => {
    if (isHovered && closable) return <CloseTabButton entity={entity} handleCloseTab={handleCloseTab} />;
    if (multipleAssembliesOpen) {
      if (entity.assembly === "GRCh38") {
        return (
          <IconWrapper>
            <HumanIcon size={16} halo={false} color={isSelected ? theme.palette.primary.main : "grey"}/>
          </IconWrapper>
        );
      } else
        return (
          <IconWrapper>
            <MouseIcon size={16} color={isSelected ? theme.palette.primary.main : "grey"}/>
          </IconWrapper>
        );
    }
  }, [closable, entity, handleCloseTab, isHovered, isSelected, multipleAssembliesOpen]);

  const dragID = entity.entityID + entity.assembly;

  return (
    <Draggable key={dragID} draggableId={dragID} index={index} disableInteractiveElementBlocking>
      {(provided, snapshot) => {
        const draggingStyles: SxProps<Theme> = snapshot.isDragging
          ? {
              backgroundColor: "white",
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
              borderRadius: 1,
            }
          : {};
        const selectedStyles: SxProps<Theme> = isSelected
          ? {
              borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
              borderTop: (theme) => `2px solid transparent`,
            }
          : {};

        return (
          <Tab
            value={index}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            role="tab" //dragHandleProps sets role to "button" which breaks keyboard navigation. Revert back
            label={formatEntityID(entity)}
            onClick={() => handleTabClick(entity)}
            iconPosition="end"
            icon={<Icon />}
            sx={{ minHeight: "48px", ...selectedStyles, ...draggingStyles }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
          />
        );
      }}
    </Draggable>
  );
};

const formatEntityID = (entity: AnyOpenEntity) => {
  if (entity.entityID.includes("%3A")) {
    const region = parseGenomicRangeString(entity.entityID);
    return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
  } else if (entity.entityType === "gene") {
    return <i>{entity.entityID}</i>;
  } else return entity.entityID;
};

// Create a styled close button that looks like an IconButton
// Needed to prevent IconButton from being child of button in tab (hydration error)
const IconWrapper = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  borderRadius: "50%",
  marginLeft: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "& svg": {
    fontSize: "1rem",
  },
}));

const CloseTabButton = ({
  entity,
  handleCloseTab,
}: {
  entity: AnyOpenEntity;
  handleCloseTab: (el: AnyOpenEntity) => void;
}) => {
  return (
    <IconWrapper
      onClick={(event) => {
        event.stopPropagation();
        handleCloseTab(entity);
      }}
    >
      <Close fontSize="inherit" />
    </IconWrapper>
  );
};
