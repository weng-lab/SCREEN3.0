import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
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
import BiosampleTables from "common/components/BiosampleTables/BiosampleTables";
import { RegistryBiosamplePlusRNA } from "./BiosampleTables/types";

interface BiosampleSelectModalProps{
  assembly: "GRCh38" | "mm10";
  open: boolean;
  setOpen: (open: boolean) => void;
  multiSelect?: boolean;
  multiSelectLimit?: number;
  initialSelected: RegistryBiosamplePlusRNA[] | null;
  onChange?: (selected: RegistryBiosamplePlusRNA[] | null) => void;
}

/**
 * @todo do some work on the typing here. If multiselect is true, selectedBiosamples should be array. If false then should be single obect.
 * Deselecting doesn't work!
 * 
 */

const BiosampleSelectModal = ({
  assembly,
  open,
  setOpen,
  onChange,
  multiSelect = false,
  multiSelectLimit = 10,
  initialSelected = []
}: BiosampleSelectModalProps) => {
  const [selected, setSelected] = useState<RegistryBiosamplePlusRNA[] | null>(initialSelected)

  useEffect(() => {
    if (open) setSelected(initialSelected);
  }, [initialSelected, open]);

  const handleBiosampleChange = (selected: RegistryBiosamplePlusRNA | RegistryBiosamplePlusRNA[]) => {
    if (multiSelect) {
      setSelected(selected as RegistryBiosamplePlusRNA[]);
    } else {
      setSelected([selected as RegistryBiosamplePlusRNA]);
    }
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    onChange(selected)
    handleClose();
  };

  console.log(selected.map((x) => x.name))

  return (
    <Dialog open={open} onClose={handleClose} disableRestoreFocus sx={{ "& .MuiDialog-paper": { maxWidth: "none" } }}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <DialogTitle>Select a biosample to view biosample specific z-scores</DialogTitle>
        <IconButton size="large" onClick={handleClose} sx={{ mr: 1 }}>
          <CloseOutlined fontSize="inherit" />
        </IconButton>
      </Stack>
      <DialogContentText mb={2} display={multiSelect ? "block" : "none"} sx={{ px: 3 }}>
        Note: Must chose {multiSelectLimit} or fewer biosamples.
      </DialogContentText>
      <DialogContent sx={{ pt: 0 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <BiosampleTables
            assembly={assembly}
            showRNAseq={true}
            selected={multiSelect ? selected.map((x) => x.name) : selected.map((x) => x.name)[0]}
            onChange={handleBiosampleChange}
            slotProps={{ paperStack: { minWidth: { xs: "300px", lg: "500px" } } }}
            allowMultiSelect={multiSelect}
            showCheckboxes={multiSelect}
          />
          {selected.length > 0 && (
            <div>
              <Typography minWidth={"350px"} visibility={selected.length > 0 ? "visible" : "hidden"} mt={2}>
                Selected Biosamples:
              </Typography>
              {selected.map((biosample, i) => {
                return (
                  <Stack minWidth={"350px"} mt={1} direction="row" alignItems={"center"} key={i}>
                    <IconButton
                      onClick={() => setSelected(prev => prev.filter((x) => x.displayname !== biosample.displayname))}
                    >
                      <Close />
                    </IconButton>
                    <Typography>{biosample.displayname}</Typography>
                  </Stack>
                );
              })}
            </div>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          onClick={handleSubmit}
          disabled={multiSelect ? selected.length > multiSelectLimit : false}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BiosampleSelectModal;
