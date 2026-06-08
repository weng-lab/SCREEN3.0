import { Avatar, Box, Paper, Typography } from "@mui/material";
import { RichTreeView, TreeViewBaseItem } from "@mui/x-tree-view";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { buildSelectedTree } from "../buildSelectedTree";
import {
  CustomTreeItemProps,
  ExtendedTreeItemProps,
  TreeViewWrapperProps,
} from "../types";
import { resolveFolderView } from "../resolveFolderView";
import { CustomTreeItem } from "./CustomTreeItem";

const attachFolderId = (
  items: TreeViewBaseItem<ExtendedTreeItemProps>[],
  folderId: string,
): TreeViewBaseItem<ExtendedTreeItemProps>[] => {
  return items.map((item) => ({
    ...item,
    folderId,
    children: item.children
      ? attachFolderId(item.children, folderId)
      : undefined,
  }));
};

function getAllExpandableItemIds(
  items: TreeViewBaseItem<ExtendedTreeItemProps>[],
): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      ids.push(item.id);
      ids.push(...getAllExpandableItemIds(item.children));
    }
  }
  return ids;
}

function FolderTree({
  items,
  LeafTreeItemComponent,
  TreeItemComponent,
  onRemove,
}: {
  items: TreeViewBaseItem<ExtendedTreeItemProps>[];
  LeafTreeItemComponent?: React.ForwardRefExoticComponent<
    CustomTreeItemProps & React.RefAttributes<HTMLLIElement>
  >;
  TreeItemComponent?: React.ForwardRefExoticComponent<
    CustomTreeItemProps & React.RefAttributes<HTMLLIElement>
  >;
  onRemove: (item: TreeViewBaseItem<ExtendedTreeItemProps>) => void;
}) {
  const allExpandableIds = useMemo(
    () => getAllExpandableItemIds(items),
    [items],
  );
  const [expandedItems, setExpandedItems] =
    useState<string[]>(allExpandableIds);

  useEffect(() => {
    setExpandedItems((prev) => {
      const newIds = allExpandableIds.filter((id) => !prev.includes(id));
      if (newIds.length > 0) {
        return [...prev, ...newIds];
      }
      return prev;
    });
  }, [allExpandableIds]);

  const handleRemoveTreeItem = (
    item: TreeViewBaseItem<ExtendedTreeItemProps>,
  ) => {
    onRemove(item);
  };

  const TreeItem = useMemo(
    () =>
      TreeItemComponent || LeafTreeItemComponent
        ? React.forwardRef<HTMLLIElement, CustomTreeItemProps>(
            function TreeItem(props, ref) {
              const item = useTreeItemModel<ExtendedTreeItemProps>(
                props.itemId,
              );
              const Component =
                item?.kind === "leaf"
                  ? (LeafTreeItemComponent ??
                    TreeItemComponent ??
                    CustomTreeItem)
                  : (TreeItemComponent ?? CustomTreeItem);

              return <Component {...props} ref={ref} />;
            },
          )
        : CustomTreeItem,
    [LeafTreeItemComponent, TreeItemComponent],
  );

  return (
    <RichTreeView
      items={items}
      expandedItems={expandedItems}
      onExpandedItemsChange={(
        _event: React.SyntheticEvent | null,
        ids: string[],
      ) => setExpandedItems(ids)}
      slots={{ item: TreeItem }}
      slotProps={{
        item: {
          onRemove: handleRemoveTreeItem,
        } as Partial<CustomTreeItemProps>,
      }}
      sx={{
        ml: 1,
        mr: 1,
        "& ul": {
          paddingInlineStart: "12px",
        },
      }}
      itemChildrenIndentation={0}
    />
  );
}

export function TreeViewWrapper({
  folders,
  selectedByFolder,
  activeViewIdByFolder,
  selectedCount,
  onRemove,
}: TreeViewWrapperProps) {
  const folderTrees = useMemo(
    () =>
      folders.flatMap((folder) => {
        const folderSelectedIds = selectedByFolder.get(folder.id);
        if (!folderSelectedIds || folderSelectedIds.size === 0) {
          return [];
        }

        const activeView = resolveFolderView(folder, activeViewIdByFolder);
        const selectedRows = folder.rows.filter((row) =>
          folderSelectedIds.has(row.id),
        );

        return [
          {
            folderId: folder.id,
            items: attachFolderId(
              buildSelectedTree({
                folderId: folder.id,
                rootLabel: folder.label,
                selectedRows,
                groupingModel: activeView.groupingModel,
                leafField: activeView.leafField,
              }),
              folder.id,
            ),
            TreeItemComponent: folder.TreeItemComponent,
            LeafTreeItemComponent: folder.LeafTreeItemComponent,
          },
        ];
      }),
    [activeViewIdByFolder, folders, selectedByFolder],
  );

  return (
    <Paper
      sx={{
        height: 500,
        width: "100%",
        border: "10px solid",
        borderColor: "grey.200",
        boxSizing: "border-box",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1,
          backgroundColor: "grey.200",
          flexShrink: 0,
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            fontSize: 14,
            fontWeight: "bold",
            bgcolor: "white",
            color: "text.primary",
          }}
        >
          {selectedCount}
        </Avatar>
        <Typography fontWeight="bold">Active Tracks</Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        {folderTrees.map((folderTree) => (
          <FolderTree
            key={folderTree.folderId}
            items={folderTree.items}
            LeafTreeItemComponent={folderTree.LeafTreeItemComponent}
            TreeItemComponent={folderTree.TreeItemComponent}
            onRemove={onRemove}
          />
        ))}
      </Box>
    </Paper>
  );
}
