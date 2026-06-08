import React from "react";
import { CustomTreeItem } from "../../../TreeView/CustomTreeItem";
import { CustomTreeItemProps } from "../../../types";
import { AssayIcon } from "./constants";

/**
 * Biosample-specific TreeItem that renders AssayIcon for assay items.
 * Wraps the generic CustomTreeItem with the AssayIcon renderer.
 */
export const BiosampleTreeItem = React.forwardRef<
  HTMLLIElement,
  CustomTreeItemProps
>(function BiosampleTreeItem(props, ref) {
  return <CustomTreeItem {...props} ref={ref} renderIcon={AssayIcon} />;
});
