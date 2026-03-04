import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";

interface SpeciesSelectProps {
  open: boolean;
  onClose: () => void;
}

const SpeciesSelect: React.FC<SpeciesSelectProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"lg"} aria-labelledby="species-select-title">
      <DialogTitle
        id="species-select-title"
        sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <Box component="span">{"Select Species"}</Box>
        <IconButton aria-label="close" onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Place DataGridPremium here */}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpeciesSelect;