import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Track, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { useMemo, useState, useEffect } from "react";
import { createSelectionStore, TrackSelect, RowInfo, rowById } from "@weng-lab/genomebrowser-ui";
import { defaultBigBed, defaultBigWig } from "./defaultConfigs";
import { ASSAY_COLORS } from "common/colors";

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
}: {
  trackStore: TrackStoreInstance;
  assembly: string;
}) {
  const [open, setOpen] = useState(false);

  const selectionStore = useMemo(() => {
    const localIds = getLocalStorage(assembly);
    const ids = localIds != null ? localIds : new Set<string>();
    return createSelectionStore(ids);
  }, [assembly]);

  const selectedIds = selectionStore((s) => s.selectedIds);
  const getTrackIds = selectionStore((s) => s.getTrackIds);

  // Get only real track IDs (no auto-generated group IDs)
  const trackIds = useMemo(() => getTrackIds(), [selectedIds, getTrackIds]);

  const tracks = trackStore((state) => state.tracks);
  const removeTrack = trackStore((state) => state.removeTrack);
  const insertTrack = trackStore((state) => state.insertTrack);

  useEffect(() => {
    const currentIds = new Set(tracks.map((t) => t.id));

    // Build tracks to add from trackIds + rowById lookup
    const tracksToAdd = Array.from(trackIds)
      .filter((id) => !currentIds.has(id))
      .map((id) => rowById.get(id))
      .filter((track): track is RowInfo => track !== undefined);
    console.log("attempting to add tracks", tracksToAdd);

    const tracksToRemove = tracks.filter((t) => {
      console.log(t);
      return !t.id.includes("ignore") && !trackIds.has(t.id);
    });
    console.log("attempting to remove tracks", tracksToRemove);

    for (const t of tracksToRemove) {
      console.log("removing track", t.id);
      removeTrack(t.id);
    }

    for (const s of tracksToAdd) {
      const track = generateTrack(s);
      console.log("inserting track", track);
      if (track === null) continue;
      insertTrack(track);
    }

    // Save the track IDs (not the auto-generated group IDs)
    setLocalStorage(trackIds, assembly);
  }, [trackIds, insertTrack, removeTrack, assembly]);

  return (
    <>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => setOpen(true)}>
        Select Tracks
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Select Tracks</DialogTitle>
        <DialogContent>
          <TrackSelect store={selectionStore} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function generateTrack(sel: RowInfo): Track {
  const color = ASSAY_COLORS[sel.assay.toLowerCase()];
  if (sel.assay.toLowerCase() === "chromhmm")
    return {
      ...defaultBigBed,
      id: sel.fileAccession || sel.experimentAccession,
      url: sel.url,
      title: sel.displayname,
      color,
    };
  return { ...defaultBigWig, id: sel.fileAccession, url: sel.url, title: sel.displayname, color };
}
