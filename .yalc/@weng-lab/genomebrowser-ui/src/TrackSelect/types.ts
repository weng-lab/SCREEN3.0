import { UseTreeItemParameters } from "@mui/x-tree-view/useTreeItem";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import {
  DataGridPremiumProps,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid-premium";
import { ReactElement, ReactNode } from "react";
import { SvgIconOwnProps } from "@mui/material";
import { FolderDefinition } from "./Folders/types";

/**
 * Custom Tree Props for RichTreeView Panel
 */
export type ExtendedTreeItemProps = {
  id: string;
  label: string;
  icon: string;
  kind?: "root" | "group" | "leaf";
  field?: string;
  value?: string;
  rowId?: string;
  folderId?: string;
  isHighlightedItem?: boolean;
  highlightName?: string;
  /**
   * list of all the experimentAccession values in the children/grandchildren of the item, or the accession of the item itself
   * this is used in updating the rowSelectionModel when removing items from the Tree View panel
   */
  allExpAccessions?: string[];
};

export type TreeViewWrapperProps = {
  folders: FolderDefinition[];
  selectedByFolder: Map<string, Set<string>>;
  activeViewIdByFolder: Map<string, string>;
  selectedCount: number;
  onRemove: (item: TreeViewBaseItem<ExtendedTreeItemProps>) => void;
};

export interface CustomLabelProps {
  id: string;
  children: React.ReactNode;
  isHighlightedItem?: boolean;
  highlightName?: string;
  icon?: React.ElementType | React.ReactElement | ReactNode;
  renderIcon?: (name: string) => ReactNode;
}

export interface CustomTreeItemProps
  extends
    Omit<UseTreeItemParameters, "rootRef">,
    Omit<React.HTMLAttributes<HTMLLIElement>, "children" | "onFocus"> {
  onRemove?: (item: TreeViewBaseItem<ExtendedTreeItemProps>) => void;
  renderIcon?: (name: string) => ReactNode;
}

/**
 * DataGrid Props
 */
interface BaseTableProps extends Omit<DataGridPremiumProps, "columns"> {
  toolbarSlot?: ReactNode;
  /**
   * If anything besides an element, renders tooltip icon to the right of the table label with specified string as tooltip contents.
   * If an element, renders the element to the right of the table label.
   */
  labelTooltip?: ReactNode;
  /**
   * Styling object for the toolbar
   */
  toolbarStyle?: React.CSSProperties;
  /**
   * Color passed as `htmlColor` to columns, filter, download and search icons
   */
  toolbarIconColor?: SvgIconOwnProps["htmlColor"];
}

export type DataGridWrapperProps = {
  rows: any[];
  columns: GridColDef[];
  groupingModel: string[];
  leafField: string;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  /** Optional custom component for rendering grouping cells */
  GroupingCellComponent?: React.FC<GridRenderCellParams>;
};

//This enforces that a downloadFileName is specified if a ReactElement is used as the label (no default )
export type DataGridProps = DataGridWrapperProps &
  BaseTableProps &
  (
    | { label?: string; downloadFileName?: string }
    | { label: ReactElement; downloadFileName: string }
    | { label?: undefined; downloadFileName?: string }
  );
