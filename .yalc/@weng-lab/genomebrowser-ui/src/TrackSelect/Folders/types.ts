import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-premium";
import { Track } from "@weng-lab/genomebrowser";
import type { TrackSelectTrackContext } from "../trackContext";
import { CustomTreeItemProps } from "../types";

export type Assembly = "GRCh38" | "mm10";

export interface FolderView {
  id: string;
  label: string;
  columns: GridColDef[];
  groupingModel: string[];
  leafField: string;
}

/** Options passed to folder-owned track factories. */
export interface CreateTrackOptions {
  assembly: Assembly;
  trackContext?: TrackSelectTrackContext;
}

/**
 * Definition for a folder in TrackSelect.
 *
 * A folder represents a category of data (e.g., biosamples, genes, etc.)
 * that can be displayed in the DataGrid and TreeView. Each folder is
 * self-contained with its own data, column definitions, and tree building logic.
 *
 * @template TRow - The type of row data stored in this folder
 */
export interface FolderDefinition<TRow = any> {
  id: string;
  label: string;
  description?: string;
  rows: TRow[];
  columns: GridColDef[];
  groupingModel: string[];
  leafField: string;

  /**
   * Creates a browser track from a folder row.
   *
   * This keeps folder-specific track creation logic colocated with the
   * folder's data and presentation logic instead of requiring consumers to
   * branch on folder IDs.
   */
  createTrack: (row: TRow, options: CreateTrackOptions) => Track | null;

  views?: FolderView[];
  ViewSelector?: React.FC<{
    views: FolderView[];
    activeViewId: string;
    onChange: (viewId: string) => void;
  }>;

  GroupingCellComponent?: React.FC<GridRenderCellParams>;
  TreeItemComponent?: React.ForwardRefExoticComponent<
    CustomTreeItemProps & React.RefAttributes<HTMLLIElement>
  >;
  LeafTreeItemComponent?: React.ForwardRefExoticComponent<
    CustomTreeItemProps & React.RefAttributes<HTMLLIElement>
  >;
}
