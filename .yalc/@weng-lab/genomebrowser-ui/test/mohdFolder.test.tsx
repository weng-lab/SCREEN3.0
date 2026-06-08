import { describe, expect, it, vi } from "vitest";
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdGroupingCell", () => ({
  MohdGroupingCell: () => null,
}));
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdTreeItem", () => ({
  MohdTreeItem: () => null,
}));
vi.mock("../src/TrackSelect/Folders/mohd/shared/MohdViewSelector", () => ({
  MohdViewSelector: () => null,
}));
import { createMohdFolder } from "../src/TrackSelect/Folders/mohd/shared/createFolder";
import type { MohdDataFile } from "../src/TrackSelect/Folders/mohd/shared/types";

describe("MOHD folder", () => {
  it("maps kit_id to kitId on normalized rows", () => {
    const folder = createMohdFolder({
      id: "mohd-test",
      label: "MOHD",
      data: [
        {
          ome: "atac",
          site: "CCH",
          sample_id: "MOHD_EA100001",
          kit_id: "CCH_0001",
          file_type: "Fold change signal",
          filename: "MOHD_EA100001_signal-FC_GRCh38_v0.bigWig",
          sex: "female",
          status: "case",
        },
      ] as MohdDataFile,
    });

    expect(folder.rows[0]).toMatchObject({
      sampleId: "MOHD_EA100001",
      kitId: "CCH_0001",
    });
  });

  it("includes a kit id column", () => {
    const folder = createMohdFolder({
      id: "mohd-test",
      label: "MOHD",
      data: [],
    });

    expect(folder.columns.some((column) => column.field === "kitId")).toBe(
      true,
    );
  });
});
