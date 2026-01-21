import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { Track, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { BiosampleRowInfo, foldersByAssembly, GeneRowInfo, TrackSelect } from "@weng-lab/genomebrowser-ui";
import { ASSAY_COLORS } from "common/colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultBigBed, defaultBigWig, defaultTranscript } from "./defaultConfigs";
import { injectCallbacks, TrackCallbacks } from "./defaultTracks";

type Assembly = "GRCh38" | "mm10";

const defaultHumanSelections = new Map<string, Set<string>>([
  ["human-genes", new Set(["gencode-basic"])],
  [
    "human-biosamples",
    new Set([
      "ccre-aggregate",
      "dnase-aggregate",
      "h3k4me3-aggregate",
      "h3k27ac-aggregate",
      "ctcf-aggregate",
      "atac-aggregate",
    ]),
  ],
]);

const defaultMouseSelections = new Map<string, Set<string>>([
  ["mouse-genes", new Set(["gencode-basic"])],
  [
    "mouse-biosamples",
    new Set([
      "ccre-aggregate",
      "dnase-aggregate",
      "h3k4me3-aggregate",
      "h3k27ac-aggregate",
      "ctcf-aggregate",
      "atac-aggregate",
    ]),
  ],
]);

export default function TrackSelectModal({
  trackStore,
  assembly,
  callbacks,
}: {
  trackStore: TrackStoreInstance;
  assembly: string;
  callbacks: TrackCallbacks;
}) {
  const [open, setOpen] = useState(false);

  const tracks = trackStore((s) => s.tracks);
  const insertTrack = trackStore((s) => s.insertTrack);
  const removeTrack = trackStore((s) => s.removeTrack);

  const folders = useMemo(() => foldersByAssembly[assembly as Assembly], [assembly]);

  const storageKey = `${assembly}-selected-tracks`;

  const initialSelection = useMemo(
    () => (assembly === "GRCh38" ? defaultHumanSelections : defaultMouseSelections),
    [assembly]
  );

  const handleSubmit = useCallback(
    (selectedByFolder: Map<string, Set<string>>) => {
      const currentIds = new Set(tracks.map((t) => t.id));
      const selectedIds = new Set<string>();
      const tracksToAdd: Array<{ row: BiosampleRowInfo | GeneRowInfo; folderId: string }> = [];

      for (const folder of folders) {
        const folderSelection = selectedByFolder.get(folder.id) ?? new Set<string>();
        folderSelection.forEach((id) => {
          selectedIds.add(id);
          if (!currentIds.has(id)) {
            const row = folder.rowById.get(id);
            if (row) {
              tracksToAdd.push({ row, folderId: folder.id });
            }
          }
        });
      }

      // Remove tracks not in selection (except those with "ignore" in ID)
      const tracksToRemove = tracks.filter((t) => !t.id.includes("ignore") && !selectedIds.has(t.id));
      for (const t of tracksToRemove) {
        removeTrack(t.id);
      }

      // Add new tracks
      for (const { row, folderId } of tracksToAdd) {
        const track = generateTrack(row, folderId, assembly as Assembly, callbacks);
        if (track) insertTrack(track);
      }
    },
    [tracks, removeTrack, insertTrack, callbacks, folders, assembly]
  );

  const handleClear = useCallback(() => {
    for (const t of tracks) {
      if (!t.id.includes("ignore")) {
        removeTrack(t.id);
      }
    }
  }, [tracks, removeTrack]);

  // On first load, apply initial selection if no stored selection exists
  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) {
      handleSubmit(initialSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => setOpen(true)}>
        Select Tracks
      </Button>
      <TrackSelect
        folders={folders}
        storageKey={storageKey}
        initialSelection={initialSelection}
        onSubmit={handleSubmit}
        onClear={handleClear}
        maxTracks={30}
        open={open}
        onClose={() => setOpen(false)}
        title="Biosample Tracks"
      />
    </>
  );
}

function generateTrack(
  row: BiosampleRowInfo | GeneRowInfo,
  folderId: string,
  assembly: Assembly,
  callbacks?: TrackCallbacks
): Track | null {
  // Handle gene folders
  if (folderId.includes("genes")) {
    const geneRow = row as GeneRowInfo;
    const track: Track = {
      ...defaultTranscript,
      id: geneRow.id,
      assembly,
      version: geneRow.versions[geneRow.versions.length - 1], // latest version
    };
    return callbacks ? injectCallbacks(track, callbacks) : track;
  }

  // Handle biosample folders
  const sel = row as BiosampleRowInfo;
  const color = ASSAY_COLORS[sel.assay.toLowerCase()] || "#000000";
  let track: Track;

  switch (sel.assay.toLowerCase()) {
    case "chromhmm":
    case "ccre":
      track = {
        ...defaultBigBed,
        id: sel.id,
        url: sel.url,
        title: sel.displayName,
        color,
      };
      break;
    default:
      track = {
        ...defaultBigWig,
        id: sel.id,
        url: sel.url,
        title: sel.displayName,
        color,
      };
  }

  return callbacks ? injectCallbacks(track, callbacks) : track;
}
