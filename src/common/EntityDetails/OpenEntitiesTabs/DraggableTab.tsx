import { Draggable } from "@hello-pangea/dnd";
import { Close } from "@mui/icons-material";
import { styled, SxProps, Tab, TabProps, Theme } from "@mui/material";
import { OpenEntity } from "./OpenEntitiesContext";
import { parseGenomicRangeString } from "common/utility";

export type DraggableTabProps = TabProps & {
  entity: OpenEntity;
  index: number;
  closable: boolean;
  isSelected: boolean;
  handleTabClick: (el: OpenEntity) => void;
  handleCloseTab: (el: OpenEntity) => void;
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
  return (
    <Draggable key={entity.entityID} draggableId={entity.entityID} index={index} disableInteractiveElementBlocking>
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
            icon={closable && <CloseTabButton entity={entity} handleCloseTab={handleCloseTab} />}
            sx={{ minHeight: "48px", ...selectedStyles, ...draggingStyles }}
            {...props}
          />
        );
      }}
    </Draggable>
  );
};

const formatEntityID = (entity: OpenEntity) => {
  if (entity.entityID.includes("%3A")) {
    const region = parseGenomicRangeString(entity.entityID);
    return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
  } else if (entity.entityType === "gene") {
    return <i>{entity.entityID}</i>;
  } else return entity.entityID;
};

// Create a styled close button that looks like an IconButton
// Needed to prevent IconButton from being child of button in tab (hydration error)
const CloseIconButton = styled("div")(({ theme }) => ({
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
  entity: OpenEntity;
  handleCloseTab: (el: OpenEntity) => void;
}) => {
  return (
    <CloseIconButton
      onClick={(event) => {
        event.stopPropagation();
        handleCloseTab(entity);
      }}
    >
      <Close fontSize="inherit" />
    </CloseIconButton>
  );
};
