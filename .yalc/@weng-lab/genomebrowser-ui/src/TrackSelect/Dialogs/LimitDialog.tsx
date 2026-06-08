import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface LimitDialogProps {
  open: boolean;
  onClose: () => void;
  maxTracks: number;
}

export function LimitDialog({ open, onClose, maxTracks }: LimitDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Track Limit Reached</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can select up to {maxTracks} tracks at a time. Please remove a
          track before adding another.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
