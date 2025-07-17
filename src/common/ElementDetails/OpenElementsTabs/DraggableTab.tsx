import { Draggable } from "@hello-pangea/dnd";
import { Close } from "@mui/icons-material";
import { styled, SxProps, Tab, TabProps, Theme } from "@mui/material";
import { OpenElement } from "common/OpenElementsContext";
import { parseGenomicRangeString } from "common/utility";

export type DraggableTabProps = TabProps & {
  element: OpenElement;
  index: number;
  closable: boolean;
  isSelected: boolean;
  handleTabClick: (el: OpenElement) => void;
  handleCloseTab: (el: OpenElement) => void;
};

export const DraggableTab = ({
  element,
  index,
  closable,
  isSelected,
  handleTabClick,
  handleCloseTab,
  ...props
}: DraggableTabProps) => {
  return (
    <Draggable key={element.elementID} draggableId={element.elementID} index={index} disableInteractiveElementBlocking>
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
          label={formatElementID(element.elementID)}
          onClick={() => handleTabClick(element)}
          iconPosition="end"
          icon={closable && <CloseTabButton element={element} handleCloseTab={handleCloseTab} />}
          sx={{ minHeight: "48px", ...selectedStyles, ...draggingStyles }}
          {...props}
          />
        );
      }}
    </Draggable>
  );
};

const formatElementID = (id: string) => {
  if (id.includes("%3A")) {
    const region = parseGenomicRangeString(id);
    return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
  } else {
    return id;
  }
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
  element,
  handleCloseTab,
}: {
  element: OpenElement;
  handleCloseTab: (el: OpenElement) => void;
}) => {
  return (
    <CloseIconButton
      onClick={(event) => {
        event.stopPropagation();
        handleCloseTab(element);
      }}
    >
      <Close fontSize="inherit" />
    </CloseIconButton>
  );
};

