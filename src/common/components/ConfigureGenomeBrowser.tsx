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
import BiosampleTables from "common/components/BiosampleTables/BiosampleTables";
import { RegistryBiosamplePlusRNA } from "./BiosampleTables/types";

const ConfigureGenomeBrowser = (props: {
  assembly: "GRCh38" | "mm10";
  handleClose?: () => void;
  onBiosampleSelect?: (selected: RegistryBiosamplePlusRNA | RegistryBiosamplePlusRNA[] | null) => void;
  multiselect?: boolean;
  selectedBiosamples?: RegistryBiosamplePlusRNA[] | null;
}) => {
  const [selectedBiosamples, setSelectedBiosamples] = useState<RegistryBiosamplePlusRNA | RegistryBiosamplePlusRNA[] | null>(props.selectedBiosamples ?? null);

  const handleSetSelected = (selected: RegistryBiosamplePlusRNA | RegistryBiosamplePlusRNA[]) => {
    if (props.multiselect) {
      setSelectedBiosamples(selected as RegistryBiosamplePlusRNA[]);
    } else {
      setSelectedBiosamples(selected as RegistryBiosamplePlusRNA);
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
      <DialogContentText mb={2} display={props.multiselect ? "block" : "none"} sx={{ px: 3 }}>
          Note: Must chose 10 or fewer biosamples to view in the genome browser.
      </DialogContentText>
      <DialogContent sx={{ pt: 0 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <BiosampleTables
            assembly={props.assembly}
            showRNAseq={true}
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
          {selectedBiosamples && (
            <div>
              {Array.isArray(selectedBiosamples) ? (
                <div>
                  <Typography minWidth={"350px"} visibility={selectedBiosamples.length > 0 ? "visible" : "hidden"} mt={2}>Selected Biosamples:</Typography>
                  {selectedBiosamples.map((biosample, i) => {
                    return (
                      <Stack minWidth={"350px"} mt={1} direction="row" alignItems={"center"} key={i}>
                        <IconButton onClick={() => setSelectedBiosamples(selectedBiosamples.filter((x) => x.displayname !== biosample.displayname))}>
                          <Close />
                        </IconButton>
                        <Typography>{biosample.displayname}</Typography>
                      </Stack>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <Typography minWidth={"350px"} mt={2}>Selected Biosample:</Typography>
                  <Stack direction="row" alignItems="center">
                    <Typography>{`Selected Biosample: ${selectedBiosamples.displayname}`}</Typography>
                    <IconButton onClick={() => setSelectedBiosamples(null)}>
                      <Close />
                    </IconButton>
                  </Stack>
                </div>
              )}
            </div>
        )}
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
