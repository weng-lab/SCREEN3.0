// @vitest-environment jsdom

import { Track, TrackType, createTrackStore } from "@weng-lab/genomebrowser";
import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildSelectedTree } from "../src/TrackSelect/buildSelectedTree";
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdGroupingCell", () => ({
  MohdGroupingCell: () => null,
}));
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdTreeItem", () => ({
  MohdTreeItem: () => null,
}));
import TrackSelect from "../src/TrackSelect/TrackSelect";
import { FolderDefinition } from "../src/TrackSelect/Folders/types";
import { humanMohdFolder } from "../src/TrackSelect/Folders/mohd/human";
import { resolveFolderView } from "../src/TrackSelect/resolveFolderView";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../src/TrackSelect/FolderList/Breadcrumb", () => ({
  Breadcrumb: ({
    currentFolder,
    onNavigateToRoot,
  }: {
    currentFolder: { label: string } | null;
    onNavigateToRoot: () => void;
  }) => (
    <button onClick={onNavigateToRoot}>
      {currentFolder ? `breadcrumb:${currentFolder.label}` : "breadcrumb:root"}
    </button>
  ),
}));

vi.mock("../src/TrackSelect/FolderList/FolderList", () => ({
  FolderList: ({
    folders,
    onFolderSelect,
  }: {
    folders: Array<{ id: string; label: string }>;
    onFolderSelect: (folderId: string) => void;
  }) => (
    <div data-testid="folder-list">
      {folders.map((folder) => (
        <button key={folder.id} onClick={() => onFolderSelect(folder.id)}>
          {folder.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../src/TrackSelect/DataGrid/DataGridWrapper", () => ({
  DataGridWrapper: ({
    leafField,
    onSelectionChange,
    rows,
    selectedIds,
  }: {
    leafField: string;
    onSelectionChange: (ids: Set<string>) => void;
    rows: Array<{ id: string }>;
    selectedIds: Set<string>;
  }) => (
    <div data-testid="data-grid">
      <div data-testid="grid-leaf-field">{leafField}</div>
      <div data-testid="grid-selected">{Array.from(selectedIds).join(",")}</div>
      <button
        onClick={() =>
          onSelectionChange(new Set(rows.slice(0, 2).map((row) => row.id)))
        }
      >
        select-first-two
      </button>
    </div>
  ),
}));

vi.mock("../src/TrackSelect/TreeView/TreeViewWrapper", () => ({
  TreeViewWrapper: ({
    activeViewIdByFolder,
    folders,
    onRemove,
    selectedByFolder,
    selectedCount,
  }: {
    activeViewIdByFolder: Map<string, string>;
    folders: Array<FolderDefinition<any>>;
    onRemove: (item: { id: string; label: string }) => void;
    selectedByFolder: Map<string, Set<string>>;
    selectedCount: number;
  }) => {
    const flattenTreeLabels = (
      items: Array<{ label: string; children?: Array<any> }>,
    ): string[] => {
      return items.flatMap((item) => [
        item.label,
        ...flattenTreeLabels(item.children ?? []),
      ]);
    };

    const flattenLeafItems = (
      items: Array<{
        label: string;
        children?: Array<any>;
        allExpAccessions?: string[];
      }>,
    ): Array<{ id?: string; label: string }> => {
      return items.flatMap((item) => {
        const children = item.children ?? [];
        const nestedLeaves = flattenLeafItems(children);
        const isLeaf =
          children.length === 0 && item.allExpAccessions?.length === 1;
        return isLeaf ? [item, ...nestedLeaves] : nestedLeaves;
      });
    };

    const folderTrees = folders.flatMap((folder) => {
      const selectedIds = selectedByFolder.get(folder.id);
      if (!selectedIds || selectedIds.size === 0) {
        return [];
      }

      const activeView = resolveFolderView(folder, activeViewIdByFolder);
      const selectedRows = folder.rows.filter((row) => selectedIds.has(row.id));

      const attachFolderId = (items: Array<any>): Array<any> => {
        return items.map((item) => ({
          ...item,
          folderId: folder.id,
          children: item.children ? attachFolderId(item.children) : undefined,
        }));
      };

      return [
        attachFolderId(
          buildSelectedTree({
            folderId: folder.id,
            rootLabel: folder.label,
            selectedRows,
            groupingModel: activeView.groupingModel,
            leafField: activeView.leafField,
          }),
        ),
      ];
    });

    const removableItem = folderTrees.flatMap((tree) =>
      flattenLeafItems(tree),
    )[1];

    return (
      <div data-testid="tree-view">
        <div data-testid="selected-count">{selectedCount}</div>
        <div data-testid="tree-labels">
          {folderTrees.flatMap((tree) => flattenTreeLabels(tree)).join(",")}
        </div>
        {removableItem ? (
          <button onClick={() => onRemove(removableItem)}>remove-second</button>
        ) : null}
      </div>
    );
  },
}));

vi.mock("../src/TrackSelect/Dialogs/ClearDialog", () => ({
  ClearDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean;
    onConfirm: () => void;
  }) => (open ? <button onClick={onConfirm}>confirm-clear</button> : null),
}));

vi.mock("../src/TrackSelect/Dialogs/ResetDialog", () => ({
  ResetDialog: ({
    open,
    onConfirm,
  }: {
    open: boolean;
    onConfirm: () => void;
  }) => (open ? <button onClick={onConfirm}>confirm-reset</button> : null),
}));

vi.mock("../src/TrackSelect/Dialogs/LimitDialog", () => ({
  LimitDialog: () => null,
}));

interface TestRow {
  id: string;
  label: string;
}

const createTestTrack = (id: string, title: string): Track =>
  ({
    id,
    title,
    height: 40,
    trackType: TrackType.Custom,
  }) as Track;

const createTestFolder = ({
  id,
  label,
  rowIds,
  withToolbarExtras = false,
}: {
  id: string;
  label: string;
  rowIds: [string, string, string];
  withToolbarExtras?: boolean;
}): FolderDefinition<TestRow> => {
  const rows = [
    { id: `${id}/${rowIds[0]}`, label: `${label} A` },
    { id: `${id}/${rowIds[1]}`, label: `${label} B` },
    { id: `${id}/${rowIds[2]}`, label: `${label} C` },
  ];

  const views = withToolbarExtras
    ? [
        {
          id: "default",
          label: "Default",
          columns: [],
          groupingModel: [],
          leafField: "label",
        },
        {
          id: "runtime",
          label: "Runtime",
          columns: [],
          groupingModel: [],
          leafField: "id",
        },
      ]
    : undefined;

  const ViewSelector = withToolbarExtras
    ? ({
        activeViewId,
        onChange,
      }: {
        activeViewId: string;
        onChange: (viewId: string) => void;
      }) => (
        <button
          data-testid="toolbar-toggle"
          onClick={() =>
            onChange(activeViewId === "runtime" ? "default" : "runtime")
          }
        >
          toolbar-toggle
        </button>
      )
    : undefined;

  return {
    id,
    label,
    rows,
    columns: [],
    groupingModel: [],
    leafField: "label",
    createTrack: (row) => createTestTrack(row.id, row.label),
    views,
    ViewSelector,
  };
};

let container: HTMLDivElement | null = null;
let root: Root | null = null;

afterEach(async () => {
  if (root) {
    await act(async () => {
      root?.unmount();
    });
  }

  root = null;
  container?.remove();
  container = null;
  document.body.innerHTML = "";
});

const renderTrackSelect = async (ui: ReactElement) => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(ui);
  });
};

const clickButton = async (label: string) => {
  const button = Array.from(document.querySelectorAll("button")).find(
    (candidate) => candidate.textContent?.trim() === label,
  );

  expect(button).toBeTruthy();

  await act(async () => {
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
};

const getText = (testId: string) => {
  const element = document.querySelector(`[data-testid="${testId}"]`);
  expect(element).toBeTruthy();
  return element?.textContent ?? "";
};

describe("TrackSelect", () => {
  it("keeps the modal flow wired through folder entry, local edits, dialogs, toolbar config, and submit", async () => {
    const folderA = createTestFolder({
      id: "folder-a",
      label: "Folder A",
      rowIds: ["managed-a", "managed-b", "managed-c"],
      withToolbarExtras: true,
    });
    const folderB = createTestFolder({
      id: "folder-b",
      label: "Folder B",
      rowIds: ["other-a", "other-b", "other-c"],
    });
    const trackStore = createTrackStore([
      createTestTrack("external-track", "External Track"),
      createTestTrack("folder-a/managed-a", "Managed A"),
    ]);
    const onClose = vi.fn();

    trackStore.getState().editTrack("folder-a/managed-a", { height: 120 });
    const committedManagedTrack = trackStore
      .getState()
      .getTrack("folder-a/managed-a");

    await renderTrackSelect(
      <TrackSelect
        assembly="GRCh38"
        folders={[folderA, folderB]}
        initialSelectedIds={{
          GRCh38: { [folderA.id]: ["folder-a/managed-a"] },
        }}
        open
        onClose={onClose}
        title="Track Select"
        trackStore={trackStore}
      />,
    );

    expect(getText("selected-count")).toBe("1");

    await clickButton("Folder A");
    expect(getText("grid-selected")).toBe("folder-a/managed-a");

    await clickButton("toolbar-toggle");
    expect(getText("grid-leaf-field")).toBe("id");

    await clickButton("select-first-two");
    expect(getText("grid-selected")).toBe(
      "folder-a/managed-a,folder-a/managed-b",
    );
    expect(getText("selected-count")).toBe("2");

    await clickButton("remove-second");
    expect(getText("grid-selected")).toBe("folder-a/managed-a");
    expect(getText("selected-count")).toBe("1");

    await clickButton("Clear");
    await clickButton("confirm-clear");
    expect(getText("grid-selected")).toBe("");
    expect(getText("selected-count")).toBe("0");

    await clickButton("Reset");
    await clickButton("confirm-reset");
    expect(getText("grid-selected")).toBe("folder-a/managed-a");
    expect(getText("selected-count")).toBe("1");

    await clickButton("Submit");

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "folder-a/managed-a",
    ]);
    expect(trackStore.getState().getTrack("folder-a/managed-a")).toBe(
      committedManagedTrack,
    );
    expect(trackStore.getState().getTrack("folder-a/managed-a")?.height).toBe(
      120,
    );
  });

  it("switches MOHD between ome and site views without losing selection", async () => {
    await renderTrackSelect(
      <TrackSelect
        assembly="GRCh38"
        folders={[humanMohdFolder]}
        initialSelectedIds={{
          GRCh38: {
            [humanMohdFolder.id]: [
              "human-mohd/MOHD_EA100001::MOHD_EA100001_peaks-FDR5_GRCh38_v0.bigBed",
            ],
          },
        }}
        open
        onClose={vi.fn()}
        title="Track Select"
      />,
    );

    expect(getText("grid-selected")).toBe(
      "human-mohd/MOHD_EA100001::MOHD_EA100001_peaks-FDR5_GRCh38_v0.bigBed",
    );
    expect(getText("tree-labels")).toContain("MOHD,ATAC,CCH,MOHD_EA100001");

    await clickButton("Site");

    expect(getText("grid-selected")).toBe(
      "human-mohd/MOHD_EA100001::MOHD_EA100001_peaks-FDR5_GRCh38_v0.bigBed",
    );
    expect(getText("tree-labels")).toContain("MOHD,CCH,ATAC,MOHD_EA100001");

    await clickButton("Ome");

    expect(getText("grid-selected")).toBe(
      "human-mohd/MOHD_EA100001::MOHD_EA100001_peaks-FDR5_GRCh38_v0.bigBed",
    );
    expect(getText("tree-labels")).toContain("MOHD,ATAC,CCH,MOHD_EA100001");
  });
});
