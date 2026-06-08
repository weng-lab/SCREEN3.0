import { Track, TrackType, createTrackStore } from "@weng-lab/genomebrowser";
import { describe, expect, it } from "vitest";
import { FolderDefinition } from "../src/TrackSelect/Folders/types";
import { diffManagedTracks } from "../src/TrackSelect/managedTracks";

interface TestRow {
  id: string;
  label: string;
}

const makeTrack = (id: string, title: string): Track => {
  return {
    id,
    title,
    height: 40,
    trackType: TrackType.Custom,
  } as Track;
};

const createTestFolder = (): FolderDefinition<TestRow> => {
  const rows = [
    { id: "test-folder/managed-a", label: "Managed A" },
    { id: "test-folder/managed-b", label: "Managed B" },
    { id: "test-folder/managed-c", label: "Managed C" },
    { id: "test-folder/managed-d", label: "Managed D" },
  ];

  return {
    id: "test-folder",
    label: "Test Folder",
    rows,
    columns: [],
    groupingModel: [],
    leafField: "label",
    createTrack: (row) => makeTrack(row.id, row.label),
  };
};

const applyManagedTrackDiff = (
  trackStore: ReturnType<typeof createTrackStore>,
  diff: ReturnType<typeof diffManagedTracks>,
) => {
  const { insertTrack, removeTrack } = trackStore.getState();
  diff.idsToRemove.forEach((id) => removeTrack(id));
  diff.tracksToAdd.forEach((track) => insertTrack(track));
};

describe("TrackSelect managed track diff", () => {
  it("preserves existing managed tracks on submit when selections do not change", () => {
    const folder = createTestFolder();
    const trackStore = createTrackStore([
      makeTrack("external-track", "External"),
      makeTrack("test-folder/managed-a", "Managed A"),
    ]);

    trackStore.getState().editTrack("test-folder/managed-a", { height: 120 });
    const editedManagedTrack = trackStore
      .getState()
      .getTrack("test-folder/managed-a");

    applyManagedTrackDiff(
      trackStore,
      diffManagedTracks({
        assembly: "GRCh38",
        currentTracks: trackStore.getState().tracks,
        folders: [folder],
        selectedByFolder: new Map([
          ["test-folder", new Set(["test-folder/managed-a"])],
        ]),
      }),
    );

    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "test-folder/managed-a",
    ]);
    expect(trackStore.getState().getTrack("test-folder/managed-a")).toBe(
      editedManagedTrack,
    );
    expect(
      trackStore.getState().getTrack("test-folder/managed-a")?.height,
    ).toBe(120);
  });

  it("appends newly selected managed tracks to the bottom of the store", () => {
    const folder = createTestFolder();
    const trackStore = createTrackStore([
      makeTrack("external-track", "External"),
      makeTrack("test-folder/managed-a", "Managed A"),
    ]);

    applyManagedTrackDiff(
      trackStore,
      diffManagedTracks({
        assembly: "GRCh38",
        currentTracks: trackStore.getState().tracks,
        folders: [folder],
        selectedByFolder: new Map([
          [
            "test-folder",
            new Set(["test-folder/managed-a", "test-folder/managed-b"]),
          ],
        ]),
      }),
    );

    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "test-folder/managed-a",
      "test-folder/managed-b",
    ]);
  });

  it("removes only deselected managed tracks while preserving unmanaged tracks", () => {
    const folder = createTestFolder();
    const trackStore = createTrackStore([
      makeTrack("external-track", "External"),
      makeTrack("test-folder/managed-a", "Managed A"),
      makeTrack("test-folder/managed-b", "Managed B"),
    ]);

    applyManagedTrackDiff(
      trackStore,
      diffManagedTracks({
        assembly: "GRCh38",
        currentTracks: trackStore.getState().tracks,
        folders: [folder],
        selectedByFolder: new Map([
          ["test-folder", new Set(["test-folder/managed-b"])],
        ]),
      }),
    );

    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "test-folder/managed-b",
    ]);
  });

  it("applies multiple managed additions and removals in one submit flow", () => {
    const folder = createTestFolder();
    const trackStore = createTrackStore([
      makeTrack("external-track", "External"),
      makeTrack("test-folder/managed-a", "Managed A"),
      makeTrack("test-folder/managed-c", "Managed C"),
    ]);

    applyManagedTrackDiff(
      trackStore,
      diffManagedTracks({
        assembly: "GRCh38",
        currentTracks: trackStore.getState().tracks,
        folders: [folder],
        selectedByFolder: new Map([
          [
            "test-folder",
            new Set(["test-folder/managed-b", "test-folder/managed-d"]),
          ],
        ]),
      }),
    );

    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "test-folder/managed-b",
      "test-folder/managed-d",
    ]);
  });

  it("uses folder-owned track creation when adding managed tracks", () => {
    const folder: FolderDefinition<TestRow> = {
      ...createTestFolder(),
      createTrack: (row) => ({
        ...makeTrack(row.id, `test-folder:${row.label}`),
        onClick: () => `${row.id}-clicked`,
      }),
    };
    const trackStore = createTrackStore([
      makeTrack("external-track", "External"),
    ]);

    applyManagedTrackDiff(
      trackStore,
      diffManagedTracks({
        assembly: "GRCh38",
        currentTracks: trackStore.getState().tracks,
        folders: [folder],
        selectedByFolder: new Map([
          ["test-folder", new Set(["test-folder/managed-a"])],
        ]),
      }),
    );

    expect(trackStore.getState().tracks.map((track) => track.id)).toEqual([
      "external-track",
      "test-folder/managed-a",
    ]);

    const managedTrack = trackStore
      .getState()
      .tracks.find((track) => track.id === "test-folder/managed-a");

    expect(managedTrack?.title).toBe("test-folder:Managed A");
    expect(typeof managedTrack?.onClick).toBe("function");
  });
});
