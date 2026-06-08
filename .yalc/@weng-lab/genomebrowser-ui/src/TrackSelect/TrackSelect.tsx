import { TreeViewBaseItem } from "@mui/x-tree-view";
import { TrackStoreInstance } from "@weng-lab/genomebrowser";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Assembly, FolderDefinition } from "./Folders/types";
import { DataGridWrapper } from "./DataGrid/DataGridWrapper";
import { ClearDialog } from "./Dialogs/ClearDialog";
import { LimitDialog } from "./Dialogs/LimitDialog";
import { ResetDialog } from "./Dialogs/ResetDialog";
import { Breadcrumb } from "./FolderList/Breadcrumb";
import { FolderList } from "./FolderList/FolderList";
import { diffManagedTracks } from "./managedTracks";
import { resolveFolderView } from "./resolveFolderView";
import type { TrackSelectTrackContext } from "./trackContext";
import { ExtendedTreeItemProps } from "./types";
import { TreeViewWrapper } from "./TreeView/TreeViewWrapper";

export type InitialSelectedIdsByAssembly = Partial<
  Record<Assembly, Record<string, string[]>>
>;

export interface TrackSelectProps {
  assembly: Assembly;
  folders: FolderDefinition[];
  initialSelectedIds?: InitialSelectedIdsByAssembly;
  sessionStorageKey?: string;
  trackStore?: TrackStoreInstance;
  onCancel?: () => void;
  maxTracks?: number;
  trackContext?: TrackSelectTrackContext;
  open: boolean;
  onClose: () => void;
  title?: string;
}

const DEFAULT_MAX_TRACKS = 30;

const DEFAULT_TITLE = "Track Select";

type ViewState = "folder-list" | "folder-detail";

const createEmptySelectedByFolder = (folders: FolderDefinition[]) => {
  return new Map(folders.map((folder) => [folder.id, new Set<string>()]));
};

const cloneSelectedByFolder = (selectedByFolder: Map<string, Set<string>>) => {
  return new Map(
    Array.from(selectedByFolder, ([folderId, ids]) => [folderId, new Set(ids)]),
  );
};

const normalizeSelectedByFolder = ({
  folders,
  selectedIdsByFolder,
}: {
  folders: FolderDefinition[];
  selectedIdsByFolder?: Record<string, string[]>;
}) => {
  const normalized = createEmptySelectedByFolder(folders);

  if (!selectedIdsByFolder) {
    return normalized;
  }

  folders.forEach((folder) => {
    const ids = selectedIdsByFolder[folder.id];
    if (!ids) {
      return;
    }

    normalized.set(
      folder.id,
      new Set(ids.filter((id) => id.startsWith(`${folder.id}/`))),
    );
  });

  return normalized;
};

const loadSelectedByFolder = ({
  assembly,
  folders,
  initialSelectedIds,
  sessionStorageKey,
}: {
  assembly: Assembly;
  folders: FolderDefinition[];
  initialSelectedIds?: InitialSelectedIdsByAssembly;
  sessionStorageKey?: string;
}) => {
  const fallback = normalizeSelectedByFolder({
    folders,
    selectedIdsByFolder: initialSelectedIds?.[assembly],
  });

  if (!sessionStorageKey || typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.sessionStorage.getItem(sessionStorageKey);
  if (!storedValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(storedValue) as Record<string, string[]>;
    return normalizeSelectedByFolder({
      folders,
      selectedIdsByFolder: parsed,
    });
  } catch {
    return fallback;
  }
};

const saveSelectedByFolder = ({
  selectedByFolder,
  sessionStorageKey,
}: {
  selectedByFolder: Map<string, Set<string>>;
  sessionStorageKey?: string;
}) => {
  if (!sessionStorageKey || typeof window === "undefined") {
    return;
  }

  const serialized = Object.fromEntries(
    Array.from(selectedByFolder, ([folderId, ids]) => [
      folderId,
      Array.from(ids),
    ]),
  );
  window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(serialized));
};

export default function TrackSelect({
  assembly,
  folders,
  initialSelectedIds,
  sessionStorageKey,
  trackStore,
  onCancel,
  maxTracks,
  trackContext,
  open,
  onClose,
  title = DEFAULT_TITLE,
}: TrackSelectProps) {
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(() =>
    folders.length > 1 ? "folder-list" : "folder-detail",
  );
  const [activeFolderId, setActiveFolderId] = useState(
    () => folders[0]?.id ?? "",
  );
  const [activeViewIdByFolder, setActiveViewIdByFolder] = useState(
    () =>
      new Map(
        folders.flatMap((folder) =>
          folder.views?.[0] ? [[folder.id, folder.views[0].id] as const] : [],
        ),
      ),
  );
  const [committedSelectedByFolder, setCommittedSelectedByFolder] = useState(
    () =>
      loadSelectedByFolder({
        assembly,
        folders,
        initialSelectedIds,
        sessionStorageKey,
      }),
  );
  const [selectedByFolder, setSelectedByFolder] = useState(() =>
    cloneSelectedByFolder(committedSelectedByFolder),
  );
  const maxTracksLimit = maxTracks ?? DEFAULT_MAX_TRACKS;

  useEffect(() => {
    setActiveFolderId((currentFolderId) => {
      if (folders.some((folder) => folder.id === currentFolderId)) {
        return currentFolderId;
      }

      return folders[0]?.id ?? "";
    });

    if (folders.length <= 1) {
      setCurrentView("folder-detail");
    }

    setActiveViewIdByFolder((current) => {
      return new Map(
        folders.flatMap((folder) => {
          if (!folder.views?.length) {
            return [];
          }

          const activeViewId = current.get(folder.id);
          if (
            activeViewId &&
            folder.views.some((view) => view.id === activeViewId)
          ) {
            return [[folder.id, activeViewId] as const];
          }

          return [[folder.id, folder.views[0].id] as const];
        }),
      );
    });
  }, [folders]);

  useEffect(() => {
    const nextCommittedSelection = loadSelectedByFolder({
      assembly,
      folders,
      initialSelectedIds,
      sessionStorageKey,
    });
    setCommittedSelectedByFolder(nextCommittedSelection);
    setSelectedByFolder(cloneSelectedByFolder(nextCommittedSelection));
  }, [assembly, folders, initialSelectedIds, sessionStorageKey]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedByFolder(cloneSelectedByFolder(committedSelectedByFolder));
  }, [committedSelectedByFolder, open]);

  useEffect(() => {
    if (!assembly || !trackStore) {
      return;
    }

    const { idsToRemove, tracksToAdd } = diffManagedTracks({
      assembly,
      currentTracks: trackStore.getState().tracks,
      folders,
      selectedByFolder: committedSelectedByFolder,
      trackContext,
    });

    const { insertTrack, removeTrack } = trackStore.getState();
    idsToRemove.forEach((id) => removeTrack(id));
    tracksToAdd.forEach((track) => insertTrack(track));
  }, [assembly, committedSelectedByFolder, folders, trackContext, trackStore]);

  const activeFolder =
    folders.find((folder) => folder.id === activeFolderId) ?? folders[0];
  const activeConfig = activeFolder
    ? resolveFolderView(activeFolder, activeViewIdByFolder)
    : undefined;
  const activeViewId = activeConfig?.id ?? "";
  const rows = activeFolder?.rows ?? [];
  const selectedIds = new Set(
    selectedByFolder.get(activeFolder?.id ?? "") ?? [],
  );
  let selectedCount = 0;
  selectedByFolder.forEach((ids) => {
    selectedCount += ids.size;
  });

  const handleFolderSelect = (folderId: string) => {
    setActiveFolderId(folderId);
    setCurrentView("folder-detail");
  };

  const handleNavigateToRoot = () => {
    setCurrentView("folder-list");
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const ViewSelector = activeFolder?.ViewSelector;

  const confirmReset = () => {
    setResetDialogOpen(false);
    setSelectedByFolder(cloneSelectedByFolder(committedSelectedByFolder));
  };

  const confirmClear = () => {
    setClearDialogOpen(false);

    const nextSelectedByFolder = new Map(selectedByFolder);

    if (currentView === "folder-detail") {
      nextSelectedByFolder.set(activeFolderId, new Set<string>());
    } else {
      folders.forEach((folder) =>
        nextSelectedByFolder.set(folder.id, new Set<string>()),
      );
    }

    setSelectedByFolder(nextSelectedByFolder);
  };

  const handleActiveViewChange = (viewId: string) => {
    if (!activeFolder) {
      return;
    }

    setActiveViewIdByFolder((prev) => {
      const next = new Map(prev);
      next.set(activeFolder.id, viewId);
      return next;
    });
  };

  const handleSelectionChange = (ids: Set<string>) => {
    if (!activeFolder) {
      return;
    }

    const filteredIds = new Set(
      Array.from(ids).filter((id) =>
        activeFolder.rows.some((row) => row.id === id),
      ),
    );

    let nextTotal = filteredIds.size;
    selectedByFolder.forEach((folderIds, folderId) => {
      if (folderId !== activeFolder.id) {
        nextTotal += folderIds.size;
      }
    });

    if (nextTotal > maxTracksLimit) {
      setLimitDialogOpen(true);
      return;
    }

    const nextSelectedByFolder = new Map(selectedByFolder);
    nextSelectedByFolder.set(activeFolder.id, filteredIds);
    setSelectedByFolder(nextSelectedByFolder);
  };

  const handleRemoveTreeItem = (
    item: TreeViewBaseItem<ExtendedTreeItemProps>,
  ) => {
    const folderId = item.folderId;
    if (!folderId || !item.allExpAccessions?.length) {
      return;
    }

    const nextSelectedByFolder = new Map(selectedByFolder);
    const nextSet = new Set(
      nextSelectedByFolder.get(folderId) ?? new Set<string>(),
    );
    item.allExpAccessions.forEach((id) => nextSet.delete(id));
    nextSelectedByFolder.set(folderId, nextSet);
    setSelectedByFolder(nextSelectedByFolder);
  };

  const handleSubmit = () => {
    saveSelectedByFolder({ selectedByFolder, sessionStorageKey });
    setCommittedSelectedByFolder(cloneSelectedByFolder(selectedByFolder));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        {title}
        <IconButton
          size="large"
          onClick={handleCancel}
          sx={{ color: "primary.contrastText", p: 0 }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ marginTop: "5px" }}>
        {!activeFolder || !activeConfig ? (
          <Box sx={{ p: 2 }}>No folders available.</Box>
        ) : (
          <Box sx={{ flex: 1, pt: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              {folders.length > 1 ? (
                <Breadcrumb
                  currentFolder={
                    currentView === "folder-detail" ? activeFolder : null
                  }
                  onNavigateToRoot={handleNavigateToRoot}
                />
              ) : (
                <Box />
              )}
              {currentView === "folder-detail" &&
              ViewSelector &&
              activeFolder.views ? (
                <ViewSelector
                  views={activeFolder.views}
                  activeViewId={activeViewId}
                  onChange={handleActiveViewChange}
                />
              ) : null}
            </Box>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  flex: { xs: "none", md: 3 },
                  minWidth: 0,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                {currentView === "folder-list" ? (
                  <FolderList
                    folders={folders}
                    onFolderSelect={handleFolderSelect}
                  />
                ) : (
                  <DataGridWrapper
                    rows={rows}
                    columns={activeConfig.columns}
                    groupingModel={activeConfig.groupingModel}
                    leafField={activeConfig.leafField}
                    label={`${rows.length} Available ${activeFolder.label}`}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    GroupingCellComponent={activeFolder.GroupingCellComponent}
                  />
                )}
              </Box>
              <Box
                sx={{
                  flex: { xs: "none", md: 2 },
                  minWidth: 0,
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <TreeViewWrapper
                  folders={folders}
                  selectedByFolder={selectedByFolder}
                  activeViewIdByFolder={activeViewIdByFolder}
                  selectedCount={selectedCount}
                  onRemove={handleRemoveTreeItem}
                />
              </Box>
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => setClearDialogOpen(true)}
                >
                  Clear
                </Button>
                {Boolean(trackStore) ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => setResetDialogOpen(true)}
                  >
                    Reset
                  </Button>
                ) : null}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" size="small" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
            <LimitDialog
              open={limitDialogOpen}
              onClose={() => setLimitDialogOpen(false)}
              maxTracks={maxTracksLimit}
            />
            <ClearDialog
              open={clearDialogOpen}
              onClose={() => setClearDialogOpen(false)}
              onConfirm={confirmClear}
              folderLabel={activeFolder.label}
              clearAll={currentView === "folder-list"}
            />
            <ResetDialog
              open={resetDialogOpen}
              onClose={() => setResetDialogOpen(false)}
              onConfirm={confirmReset}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
