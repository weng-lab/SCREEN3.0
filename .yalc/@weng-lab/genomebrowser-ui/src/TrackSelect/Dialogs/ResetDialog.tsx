import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onClose, onConfirm }: ResetDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontWeight: "bold",
        }}
      >
        Reset to Browser State
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText>
          Are you sure you want to reset all selections to the current browser
          state?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button variant="outlined" color="secondary" onClick={onConfirm}>
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
