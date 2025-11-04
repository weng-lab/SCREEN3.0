import { Draggable } from "@hello-pangea/dnd";
import { Close, Error } from "@mui/icons-material";
import { CircularProgress, styled, SxProps, Tab, TabProps, Theme, Tooltip } from "@mui/material";
import { AnyOpenEntity, OpenEntitiesContext } from "common/OpenEntitiesContext";
import { parseGenomicRangeString, truncateString } from "common/utility";
import { useCallback, useContext, useMemo, useState } from "react";
import HumanIcon from "common/components/HumanIcon";
import MouseIcon from "common/components/MouseIcon";
import { theme } from "app/theme";
import useEntityLabelFormat from "common/hooks/useEntityLabelFormat";

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
            <HumanIcon size={16} halo={false} color={isSelected ? theme.palette.primary.main : "grey"} />
          </IconWrapper>
        );
      } else
        return (
          <IconWrapper>
            <MouseIcon size={16} color={isSelected ? theme.palette.primary.main : "grey"} />
          </IconWrapper>
        );
    }
  }, [closable, entity, handleCloseTab, isHovered, isSelected, multipleAssembliesOpen]);

  const dragID = entity.entityID + entity.assembly;

  const { label, loading, error } = useEntityLabelFormat(entity);

  const labelEl = useMemo(() => {
    if (loading) return <CircularProgress size={26} />;
    if (error) return <Error fontSize="small" />;
    if (entity.entityType === "gwas") return truncateString(label as string, 20);
    else return label;
  }, [entity.entityType, error, label, loading]);

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
          <Tooltip title={entity.entityType === "gwas" && (label as string).length > 20 ? label : ""} arrow>
            <Tab
              value={index}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              role="tab" //dragHandleProps sets role to "button" which breaks keyboard navigation. Revert back
              label={labelEl}
              onClick={() => handleTabClick(entity)}
              iconPosition="end"
              icon={<Icon />}
              sx={{ minHeight: "48px", ...selectedStyles, ...draggingStyles }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              {...props}
            />
          </Tooltip>
        );
      }}
    </Draggable>
  );
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
