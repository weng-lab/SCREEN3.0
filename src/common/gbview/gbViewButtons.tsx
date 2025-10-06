import { Box, Button } from "@mui/material";
import { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { useState } from "react";
import HighlightDialog from "./highlightDialog";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import ConfigureGBModal from "common/components/ConfigureGBModal";
import { Assembly } from "types/globalTypes";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";

export default function GBButtons({
  browserStore,
  assembly,
  onBiosampleSelected,
  selectedBiosamples,
}: {
  browserStore: BrowserStoreInstance;
  assembly: string;
  onBiosampleSelected: (biosample: RegistryBiosamplePlusRNA[] | null) => void;
  selectedBiosamples?: RegistryBiosamplePlusRNA[] | null;
}) {
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const [biosampleOpen, setBiosampleOpen] = useState(false);

  const handleSelectBiosampleClick = () => {
    setBiosampleOpen(!biosampleOpen);
  };

  const handleBiosampleSelected = (biosample: RegistryBiosamplePlusRNA[] | null) => {
    console.log("biosample rnaseq", biosample);
    onBiosampleSelected(biosample);
  };

  return (
    <Box display="flex" gap={2}>
      <Button
        variant="contained"
        startIcon={<HighlightIcon />}
        size="small"
        onClick={() => setHighlightDialogOpen(true)}
      >
        View Current Highlights
      </Button>
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => handleSelectBiosampleClick()}>
        Select Biosample
      </Button>
      <ConfigureGBModal
        assembly={assembly as Assembly}
        open={biosampleOpen}
        setOpen={handleSelectBiosampleClick}
        onBiosampleSelect={handleBiosampleSelected}
        multiselect={true}
        selectedBiosamples={selectedBiosamples ?? null}
      />
    </Box>
  );
}
