import Folder from "@mui/icons-material/Folder";
import IndeterminateCheckBoxRoundedIcon from "@mui/icons-material/IndeterminateCheckBoxRounded";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { alpha, styled } from "@mui/material/styles";
import {
  TreeItemCheckbox,
  TreeItemIconContainer,
  TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { useTreeItem } from "@mui/x-tree-view/useTreeItem";
import React, { ReactNode } from "react";
import {
  CustomLabelProps,
  CustomTreeItemProps,
  ExtendedTreeItemProps,
} from "../types";

const TreeItemRoot = styled("li")(({ theme }) => ({
  listStyle: "none",
  margin: 0,
  padding: 0,
  outline: 4,
  color: theme.palette.grey[400],
  ...theme.applyStyles("light", {
    color: theme.palette.grey[600],
  }),
}));

const TreeItemLabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontFamily: "inherit",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

function CustomLabel({
  icon: Icon,
  children,
  isHighlightedItem,
  highlightName,
  renderIcon,
  ...other
}: CustomLabelProps) {
  const variant = "body2";
  const fontWeight = 500;
  const labelText = typeof children === "string" ? children : "";
  return (
    <TreeItemLabel
      {...other}
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: 0,
        overflow: "hidden",
        flex: 1,
      }}
    >
      {Icon && React.isValidElement(Icon) ? (
        <Box className="labelIcon" sx={{ mr: 1, flexShrink: 0 }}>
          {Icon}
        </Box>
      ) : (
        <Box
          component={Icon as React.ElementType}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem", flexShrink: 0 }}
        />
      )}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ minWidth: 0, overflow: "hidden", flex: 1 }}
      >
        {isHighlightedItem && highlightName && renderIcon && (
          <Box sx={{ flexShrink: 0 }}>{renderIcon(highlightName)}</Box>
        )}
        <Tooltip title={labelText} enterDelay={500} placement="top">
          <TreeItemLabelText fontWeight={fontWeight} variant={variant}>
            {labelText}
          </TreeItemLabelText>
        </Tooltip>
      </Stack>
    </TreeItemLabel>
  );
}

const TreeItemContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(2),
  paddingLeft: `calc(${theme.spacing(1)} + 6px * var(--TreeView-itemDepth))`,
  width: "100%",
  boxSizing: "border-box",
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  flexDirection: "row-reverse",
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  fontWeight: 500,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: "white",
    ...theme.applyStyles("light", {
      color: theme.palette.primary.main,
    }),
  },
}));

const getIconFromTreeItemType = (
  itemType: string,
  renderIcon?: (name: string) => ReactNode,
) => {
  switch (itemType) {
    case "folder":
      return Folder;
    case "removeable":
      return IndeterminateCheckBoxRoundedIcon;
    default:
      return renderIcon ? renderIcon(itemType) : Folder;
  }
};

export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    id,
    itemId,
    label,
    disabled,
    children,
    onRemove,
    renderIcon,
    ...other
  } = props;

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
  } = useTreeItem({
    id,
    itemId,
    children,
    label,
    disabled,
    rootRef: ref as never,
  });

  const item = useTreeItemModel<ExtendedTreeItemProps>(itemId)!;
  const icon = getIconFromTreeItemType(item.icon, renderIcon);
  const rootProps = getRootProps(other) as React.ComponentPropsWithoutRef<"li">;

  const handleRemoveIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(item);
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...rootProps}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <TreeItemCheckbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({
              icon:
                item.icon === "removeable" ? (
                  <Box
                    onClick={handleRemoveIconClick}
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      cursor: "pointer",
                      mr: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <IndeterminateCheckBoxRoundedIcon fontSize="small" />
                  </Box>
                ) : (
                  icon
                ),
              expandable: (status.expandable && status.expanded).toString(),
              isHighlightedItem: item.isHighlightedItem,
              highlightName: item.highlightName,
              id: item.id,
              renderIcon,
            })}
          />
        </TreeItemContent>
        {children && <Collapse {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});
