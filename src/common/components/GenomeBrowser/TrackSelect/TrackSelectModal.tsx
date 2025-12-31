import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Track, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { createSelectionStore, RowInfo, TrackSelect } from "@weng-lab/genomebrowser-ui";
import { Assembly } from "@weng-lab/genomebrowser-ui/dist/TrackSelect/consts";
import { ASSAY_COLORS } from "common/colors";
import { useCallback, useMemo, useState } from "react";
import { defaultBigBed, defaultBigWig } from "./defaultConfigs";
import { injectCallbacks, TrackCallbacks } from "./defaultTracks";

function getLocalStorage(assembly: string): Set<string> | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;

  const selectedIds = sessionStorage.getItem(assembly + "-selected-tracks");
  if (!selectedIds) return null;
  const idsArray = JSON.parse(selectedIds) as string[];
  return new Set(idsArray);
}

function setLocalStorage(trackIds: Set<string>, assembly: string) {
  sessionStorage.setItem(assembly + "-selected-tracks", JSON.stringify([...trackIds]));
}

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

  const selectionStore = useMemo(() => {
    const localIds = getLocalStorage(assembly);
    const ids = localIds != null ? localIds : new Set<string>();
    return createSelectionStore(assembly as Assembly, ids);
  }, [assembly]);

  const rowById = selectionStore((s) => s.rowById);

  const handleSubmit = useCallback(
    (newTrackIds: Set<string>) => {
      const currentIds = new Set(tracks.map((t) => t.id));

      // Build tracks to add from newTrackIds + rowById lookup
      const tracksToAdd = Array.from(newTrackIds)
        .filter((id) => !currentIds.has(id)) // not in current track list
        .map((id) => rowById.get(id)) // get RowInfo object
        .filter((track): track is RowInfo => track !== undefined); // filter out undefined

      const tracksToRemove = tracks.filter((t) => {
        return !t.id.includes("ignore") && !newTrackIds.has(t.id);
      });

      console.log("removing", tracksToRemove);
      for (const t of tracksToRemove) {
        removeTrack(t.id);
      }

      for (const s of tracksToAdd) {
        const track = generateTrack(s, callbacks);
        if (track === null) continue;
        insertTrack(track);
      }

      // Save the track IDs (not the auto-generated group IDs)
      setLocalStorage(newTrackIds, assembly);
      // Close the dialog
      setOpen(false);
    },
    [tracks, removeTrack, insertTrack, callbacks, assembly, rowById]
  );

  const handleCancel = () => {
    setOpen(false);
  };

  // Handle reset: clear selections and remove non-default tracks
  const handleReset = () => {
    // Clear the selection store
    selectionStore.getState().clear();

    // Remove all non-default tracks from the browser
    const tracksToRemove = tracks.filter((t) => !t.id.includes("ignore"));
    for (const t of tracksToRemove) {
      removeTrack(t.id);
    }

    // Clear localStorage for selected tracks
    setLocalStorage(new Set(), assembly);
  };

  return (
    <>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => setOpen(true)}>
        Select Tracks
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle
          bgcolor="#0c184a"
          color="white"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          fontWeight={"bold"}
        >
          Biosample Tracks
          <IconButton size="large" onClick={() => setOpen(false)} sx={{ color: "white", padding: 0 }}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TrackSelect store={selectionStore} onSubmit={handleSubmit} onCancel={handleCancel} onReset={handleReset} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function generateTrack(sel: RowInfo, callbacks?: TrackCallbacks): Track {
  const color = ASSAY_COLORS[sel.assay.toLowerCase()] || "#000000";
  let track: Track;

  switch (sel.assay.toLowerCase()) {
    case "chromhmm":
      track = {
        ...defaultBigBed,
        id: sel.id,
        url: sel.url,
        title: sel.displayname,
        color,
      };
      break;
    case "ccre":
      track = {
        ...defaultBigBed,
        id: sel.id,
        url: sel.url,
        title: sel.displayname,
        color,
      };
      break;
    default:
      track = {
        ...defaultBigWig,
        id: sel.id,
        url: sel.url,
        title: sel.displayname,
        color,
      };
  }

  return callbacks ? injectCallbacks(track, callbacks) : track;
}
