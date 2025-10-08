import { Box, Button, Dialog } from "@mui/material";
import { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { useState } from "react";
import HighlightDialog from "./highlightDialog";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import ConfigureGBModal from "common/components/ConfigureGBModal";
import { Assembly } from "types/globalTypes";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";
import { ChromHmmDialog } from "./ChromHMM/ChromHmmDialog";

export default function GBButtons({
  browserStore,
  assembly,
  onBiosampleSelected,
  selectedBiosamples,
  selectedChromHmmTissues,
  setSelectedChromHmmTissues
}: {
  browserStore: BrowserStoreInstance;
  assembly: string;
  onBiosampleSelected: (biosample: RegistryBiosamplePlusRNA[] | null) => void;
  selectedBiosamples?: RegistryBiosamplePlusRNA[] | null;
  selectedChromHmmTissues: string[];
  setSelectedChromHmmTissues: (newTissues: string[]) => void
}) {
  const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
  const [biosampleOpen, setBiosampleOpen] = useState(false);
  const [chromHmmDialogOpen, setChromHmmDialogOpen] = useState(false)

  const handleSelectBiosampleClick = () => {
    setBiosampleOpen(!biosampleOpen);
  };

  const handleBiosampleSelected = (biosample: RegistryBiosamplePlusRNA[] | null) => {
    onBiosampleSelected(biosample);
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="contained"
        startIcon={<HighlightIcon />}
        size="small"
        onClick={() => setHighlightDialogOpen(true)}
      >
        Highlights
      </Button>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => handleSelectBiosampleClick()}>
        Biosample Tracks
      </Button>
      {assembly === "GRCh38" && (
        <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={() => setChromHmmDialogOpen(true)}>
          Chrom HMM Tracks
        </Button>
      )}
      <HighlightDialog open={highlightDialogOpen} setOpen={setHighlightDialogOpen} browserStore={browserStore} />
      <ChromHmmDialog
        open={chromHmmDialogOpen}
        setOpen={setChromHmmDialogOpen}
        selectedChromHmmTissues={selectedChromHmmTissues}
        setSelectedChromHmmTissues={setSelectedChromHmmTissues}
      />
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
