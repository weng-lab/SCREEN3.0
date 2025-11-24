import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TrackStoreInstance } from "@weng-lab/genomebrowser";
import { useState } from "react";

export default function TrackSelect({ trackStore }: { trackStore: TrackStoreInstance }) {
  const [open, setOpen] = useState(false);
  const tracks = trackStore((state) => state.tracks);

  return (
    <>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => setOpen(true)}>
        Select Tracks
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Tracks</DialogTitle>
        <DialogContent>
          {tracks.map((track) => {
            return <div key={track.id}>{track.title}</div>;
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}
