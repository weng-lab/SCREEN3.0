import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ClearDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folderLabel: string;
  clearAll: boolean;
}

export function ClearDialog({
  open,
  onClose,
  onConfirm,
  folderLabel,
  clearAll,
}: ClearDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontWeight: "bold",
        }}
      >
        {clearAll ? "Clear All Folders" : `Clear ${folderLabel}`}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <DialogContentText>
          {clearAll ? (
            "Are you sure you want to clear all selections?"
          ) : (
            <>
              Are you sure you want to clear the selection for{" "}
              <strong>{folderLabel}</strong>?
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
        <Button variant="contained" color="primary" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button variant="outlined" color="secondary" onClick={onConfirm}>
          Clear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
