import { FolderDefinition, FolderView } from "./Folders/types";

export const resolveFolderView = (
  folder: FolderDefinition,
  activeViewIdByFolder: Map<string, string>,
): FolderView => {
  const activeViewId = activeViewIdByFolder.get(folder.id);
  const activeView = folder.views?.find((view) => view.id === activeViewId);

  return (
    activeView ??
    folder.views?.[0] ?? {
      id: "default",
      label: folder.label,
      columns: folder.columns,
      groupingModel: folder.groupingModel,
      leafField: folder.leafField,
    }
  );
};
