import { useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, CloseOutlined } from "@mui/icons-material";

import BiosampleTables from "app/_biosampleTables/BiosampleTables";
import { RegistryBiosample } from "app/_biosampleTables/types";

const ConfigureGenomeBrowser = (props: {
  assembly: "GRCh38" | "mm10";
  handleClose?: () => void;
  onBiosampleSelect?: (selected: RegistryBiosample | RegistryBiosample[] | null) => void;
  multiselect?: boolean;
}) => {
  const [selectedBiosamples, setSelectedBiosamples] = useState<RegistryBiosample | RegistryBiosample[] | null>(null);

  const handleSetSelected = (selected: RegistryBiosample | RegistryBiosample[]) => {
    if (props.multiselect) {
      setSelectedBiosamples(selected as RegistryBiosample[]);
    } else {
      setSelectedBiosamples(selected as RegistryBiosample);
    }
  };

  const handleRemove = (name: string) => {
    if (!selectedBiosamples) return;
    if (Array.isArray(selectedBiosamples)) {
      setSelectedBiosamples(selectedBiosamples.filter((s) => s.name !== name));
    } else {
      setSelectedBiosamples(null);
    }
  };

  const handleSubmit = () => {
    props.onBiosampleSelect?.(selectedBiosamples);
    props.handleClose?.();
  };

  const isDisabled =
    !selectedBiosamples ||
    (Array.isArray(selectedBiosamples) &&
      (selectedBiosamples.length === 0 || selectedBiosamples.length > 10));

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <DialogTitle>Select a biosample to view biosample specific z-scores</DialogTitle>
        {props.handleClose && (
          <IconButton size="large" onClick={props.handleClose} sx={{ mr: 1 }}>
            <CloseOutlined fontSize="inherit" />
          </IconButton>
        )}
      </Stack>
      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText>Select biosample{props.multiselect && "s"}</DialogContentText>
        {selectedBiosamples && (
          <Stack direction="row" flexWrap="wrap" mt={2} mb={1} spacing={1}>
            {Array.isArray(selectedBiosamples) ? (
              selectedBiosamples.map((sample) => (
                <Stack
                  key={sample.name}
                  direction="row"
                  alignItems="center"
                  sx={{ border: "1px solid", borderRadius: 1, px: 1 }}
                >
                  <Typography>{sample.displayname}</Typography>
                  <IconButton size="small" onClick={() => handleRemove(sample.name)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Stack direction="row" alignItems="center">
                <Typography>{`Selected Biosample: ${selectedBiosamples.displayname}`}</Typography>
                <IconButton onClick={() => setSelectedBiosamples(null)}>
                  <Close />
                </IconButton>
              </Stack>
            )}
          </Stack>
        )}
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
          <BiosampleTables
            assembly={props.assembly}
            selected={
              Array.isArray(selectedBiosamples)
                ? selectedBiosamples.map((s) => s.name)
                : selectedBiosamples?.name
            }
            onChange={handleSetSelected}
            slotProps={{ paperStack: { minWidth: { xs: "300px", lg: "500px" } } }}
            allowMultiSelect={props.multiselect}
            showCheckboxes={props.multiselect}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={!props.handleClose && { position: "fixed", bottom: 15, right: 15, zIndex: 1 }}>
        <Tooltip
          title={
            Array.isArray(selectedBiosamples) && selectedBiosamples.length > 10
              ? "You can only select up to 10 biosamples"
              : !selectedBiosamples ||
                (Array.isArray(selectedBiosamples) && selectedBiosamples.length === 0)
                ? "Please select a biosample"
                : ""
          }
          placement="top"
          arrow
        >
          <span>
            <Button
              sx={{ textTransform: "none" }}
              variant="contained"
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </>
  );
};

export default ConfigureGenomeBrowser;
