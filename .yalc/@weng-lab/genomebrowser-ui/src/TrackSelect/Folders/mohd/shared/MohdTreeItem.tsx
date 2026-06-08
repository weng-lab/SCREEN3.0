import React from "react";
import { CustomTreeItem } from "../../../TreeView/CustomTreeItem";
import { CustomTreeItemProps } from "../../../types";
import { MohdOmeIcon } from "./config";

export const MohdTreeItem = React.forwardRef<
  HTMLLIElement,
  CustomTreeItemProps
>(function MohdTreeItem(props, ref) {
  return (
    <CustomTreeItem
      {...props}
      ref={ref}
      renderIcon={(type) => <MohdOmeIcon type={type} />}
    />
  );
});
