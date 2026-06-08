import { renderToStaticMarkup } from "react-dom/server";
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
import { MohdOmeIcon } from "../src/TrackSelect/Folders/mohd/shared/config";

describe("MOHD display helpers", () => {
  it("renders an ome color icon", () => {
    const html = renderToStaticMarkup(<MohdOmeIcon type="ATAC" />);

    expect(html).toContain("mohd-ome-icon-atac");
  });

  it("wires MOHD-specific grouping and tree components onto the folder", () => {
    expect(humanMohdFolder.GroupingCellComponent).toBeTruthy();
    expect(humanMohdFolder.TreeItemComponent).toBeTruthy();
  });

  it("marks ome nodes in the selected tree for icon rendering", () => {
    const selectedRows = humanMohdFolder.rows.filter(
      (row) => row.sampleId === "MOHD_EA100001",
    );

    const tree = buildSelectedTree({
      folderId: humanMohdFolder.id,
      rootLabel: humanMohdFolder.label,
      selectedRows,
      groupingModel: ["ome", "site", "sampleId"],
      leafField: "description",
    });

    expect(tree[0]?.children?.[0]?.label).toBe("ATAC");
    expect(tree[0]?.children?.[0]?.highlightName).toBe("ATAC");
    expect(tree[0]?.children?.[0]?.isHighlightedItem).toBe(true);
  });
});
