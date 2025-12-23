import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Track, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { useMemo, useState, useEffect } from "react";
import { createSelectionStore, TrackSelect } from "@weng-lab/genomebrowser-ui";
import { RowInfo } from "@weng-lab/genomebrowser-ui/dist/TrackSelect/types";
import { defaultBigBed, defaultBigWig } from "./defaultConfigs";
import { ASSAY_COLORS } from "common/colors";

function getLocalStorage(assembly: string) {
  if (typeof window === "undefined" || !window.sessionStorage) return null;

  const selectedTracks = sessionStorage.getItem(assembly + "-selected-tracks");
  if (!selectedTracks) return null;
  const localTracksJson = JSON.parse(selectedTracks);
  const map = new Map<string, RowInfo>(localTracksJson);
  console.log(map);
  return map;
}

function setLocalStorage(tracks: Map<string, RowInfo>, assembly: string) {
  sessionStorage.setItem(assembly + "-selected-tracks", JSON.stringify([...tracks.entries()]));
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
    const localTracks = getLocalStorage(assembly);
    const map = localTracks != null ? localTracks : new Map<string, RowInfo>();
    return createSelectionStore(map);
  }, [assembly]);

  const selectedTracks = selectionStore((s) => s.selectedTracks);

  const tracks = trackStore((state) => state.tracks);
  const removeTrack = trackStore((state) => state.removeTrack);
  const insertTrack = trackStore((state) => state.insertTrack);

  useEffect(() => {
    const currentIds = new Set(tracks.map((t) => t.id));

    const tracksToAdd = Array.from(selectedTracks.entries())
      .filter(([id]) => !currentIds.has(id))
      .map(([_, track]) => track);
    console.log("attempting to add tracks", tracksToAdd);

    const tracksToRemove = tracks.filter((t) => {
      console.log(t);
      return !t.id.includes("ignore") && !selectedTracks.has(t.id);
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
    setLocalStorage(selectedTracks, assembly);
  }, [selectedTracks, insertTrack, removeTrack, assembly]);

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
