import { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close, CloseOutlined } from "@mui/icons-material";

import BiosampleTables from "app/_biosampleTables/BiosampleTables";
import { RegistryBiosample } from "app/_biosampleTables/types";

const ConfigureGenomeBrowser = (props: {
  assembly: "GRCh38" | "mm10";
  /**
   * Specifying this also moves the copy/DL/Open button group to bottom right, as it assumes it's being used in cCRE details
   */
  handleClose?: () => void;
  onBiosampleSelect?: (selected: RegistryBiosample | null) => void; // <-- Add this line
}) => {
  const [selectedBiosamples, setSelectedBiosamples] = useState<RegistryBiosample>(null);

  const handleSetSelected = (selected: RegistryBiosample) => {
    setSelectedBiosamples(selected);
  };
  const handleSubmit = () => {
    props.onBiosampleSelect?.(selectedBiosamples); // send to parent
    props.handleClose?.(); // close dialog
  };

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <DialogTitle>Select a biosample to view biosample specific zscores </DialogTitle>
        {props.handleClose && (
          <IconButton size="large" onClick={props.handleClose} sx={{ mr: 1 }}>
            <CloseOutlined fontSize="inherit" />
          </IconButton>
        )}
      </Stack>
      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText>Select biosample</DialogContentText>

        {/* Selected biosample shown above the table */}
        {selectedBiosamples && (
          <Stack direction="row" alignItems="center" mt={2} mb={1}>
            <Typography>{`Selected Biosample: ${selectedBiosamples.displayname}`}</Typography>
            <IconButton onClick={() => handleSetSelected(null)}>
              <Close />
            </IconButton>
          </Stack>
        )}

        <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
          <BiosampleTables
            assembly={props.assembly}
            selected={selectedBiosamples?.name}
            onChange={handleSetSelected}
            slotProps={{ paperStack: { minWidth: { xs: "300px", lg: "500px" } } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={!props.handleClose && { position: "fixed", bottom: 15, right: 15, zIndex: 1 }}>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          disabled={!selectedBiosamples}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default ConfigureGenomeBrowser;
