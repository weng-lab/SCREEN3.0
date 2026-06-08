import { describe, expect, it, vi } from "vitest";
import { buildSelectedTree } from "../src/TrackSelect/buildSelectedTree";
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdGroupingCell", () => ({
  MohdGroupingCell: () => null,
}));
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdTreeItem", () => ({
  MohdTreeItem: () => null,
}));
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdViewSelector", () => ({
  MohdViewSelector: () => null,
}));
import { humanMohdFolder } from "../src/TrackSelect/Folders/mohd/human";
import { FolderDefinition } from "../src/TrackSelect/Folders/types";
import { resolveFolderView } from "../src/TrackSelect/resolveFolderView";

interface TestRow {
  id: string;
  label: string;
  group: string;
}

const createTestFolder = (
  id: string,
  overrides: Partial<FolderDefinition<TestRow>> = {},
): FolderDefinition<TestRow> => {
  const rows = [
    { id: `${id}-a`, label: `${id} A`, group: "group-1" },
    { id: `${id}-b`, label: `${id} B`, group: "group-1" },
    { id: `${id}-c`, label: `${id} C`, group: "group-2" },
  ];

  return {
    id,
    label: id,
    rows,
    columns: [],
    groupingModel: [],
    leafField: "label",
    createTrack: () => null,
    ...overrides,
  };
};

describe("TrackSelect direct view helpers", () => {
  it("resolves the active folder view with sensible fallback behavior", () => {
    const folder = createTestFolder("folder-a", {
      views: [
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
          columns: [{ field: "runtime-label" } as never],
          groupingModel: ["group"],
          leafField: "id",
        },
      ],
    });

    expect(resolveFolderView(folder, new Map()).id).toBe("default");
    expect(
      resolveFolderView(folder, new Map([[folder.id, "runtime"]])).id,
    ).toBe("runtime");
    expect(
      resolveFolderView(folder, new Map([[folder.id, "missing"]])).id,
    ).toBe("default");
  });

  it("builds a flat selected tree from the leaf field when there is no grouping", () => {
    const folder = createTestFolder("folder-a");

    const tree = buildSelectedTree({
      folderId: folder.id,
      rootLabel: folder.label,
      selectedRows: folder.rows.slice(0, 2),
      groupingModel: [],
      leafField: "label",
    });

    expect(tree[0]?.label).toBe(folder.label);
    expect(tree[0]?.children?.map((item) => item.label)).toEqual([
      "folder-a A",
      "folder-a B",
    ]);
  });

  it("builds grouped selected trees that match the configured grouping model", () => {
    const folder = createTestFolder("folder-a");

    const tree = buildSelectedTree({
      folderId: folder.id,
      rootLabel: folder.label,
      selectedRows: folder.rows,
      groupingModel: ["group"],
      leafField: "label",
    });

    expect(tree[0]?.children?.map((item) => item.label)).toEqual([
      "group-1",
      "group-2",
    ]);
    expect(tree[0]?.children?.[0]?.children?.map((item) => item.label)).toEqual(
      ["folder-a A", "folder-a B"],
    );
  });

  it("uses the default MOHD view to group by ome, then site, then sample", () => {
    const activeView = resolveFolderView(humanMohdFolder, new Map());
    const selectedRows = humanMohdFolder.rows.filter(
      (row) => row.sampleId === "MOHD_EA100001",
    );

    const tree = buildSelectedTree({
      folderId: humanMohdFolder.id,
      rootLabel: humanMohdFolder.label,
      selectedRows,
      groupingModel: activeView.groupingModel,
      leafField: activeView.leafField,
    });

    expect(activeView.id).toBe("ome");
    expect(tree[0]?.children?.map((item) => item.label)).toEqual(["ATAC"]);
    expect(tree[0]?.children?.[0]?.children?.map((item) => item.label)).toEqual(
      ["CCH"],
    );
    expect(
      tree[0]?.children?.[0]?.children?.[0]?.children?.map(
        (item) => item.label,
      ),
    ).toEqual(["MOHD_EA100001"]);
    expect(
      tree[0]?.children?.[0]?.children?.[0]?.children?.[0]?.children?.map(
        (item) => item.label,
      ),
    ).toEqual([
      "FDR 0.05 peaks",
      "Fold change signal",
      "Pseudorep peaks",
      "p-value signal",
    ]);
  });

  it("builds the selected MOHD tree from the site-first view when active", () => {
    const activeView = resolveFolderView(
      humanMohdFolder,
      new Map([[humanMohdFolder.id, "site"]]),
    );
    const selectedRows = humanMohdFolder.rows.filter(
      (row) => row.sampleId === "MOHD_EA100001",
    );

    const tree = buildSelectedTree({
      folderId: humanMohdFolder.id,
      rootLabel: humanMohdFolder.label,
      selectedRows,
      groupingModel: activeView.groupingModel,
      leafField: activeView.leafField,
    });

    expect(activeView.id).toBe("site");
    expect(tree[0]?.children?.map((item) => item.label)).toEqual(["CCH"]);
    expect(tree[0]?.children?.[0]?.children?.map((item) => item.label)).toEqual(
      ["ATAC"],
    );
    expect(
      tree[0]?.children?.[0]?.children?.[0]?.children?.map(
        (item) => item.label,
      ),
    ).toEqual(["MOHD_EA100001"]);
  });
});
