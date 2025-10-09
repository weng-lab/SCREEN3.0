import { RegistryBiosamplePlusRNA } from "./BiosampleTables/types";
import ConfigureGenomeBrowser from "./ConfigureGenomeBrowser";
import { Dialog } from "@mui/material";

interface Props {
  assembly: "mm10" | "GRCh38";
  open: boolean;
  multiselect?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBiosampleSelect: (biosample: RegistryBiosamplePlusRNA | RegistryBiosamplePlusRNA[] | null) => void;
  selectedBiosamples?: RegistryBiosamplePlusRNA[] | null;
}

const ConfigureGBModal: React.FC<Props> = ({ assembly, open, multiselect, setOpen, onBiosampleSelect, selectedBiosamples }) => {
  const allowMultiSelect = multiselect ? multiselect : false;
  
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus sx={{ '& .MuiDialog-paper': { maxWidth: "none" } }}>
      <ConfigureGenomeBrowser assembly={assembly} multiselect={allowMultiSelect} handleClose={() => setOpen(false)} onBiosampleSelect={onBiosampleSelect} selectedBiosamples={selectedBiosamples ?? null}/>
    </Dialog>
  );
};

export default ConfigureGBModal;
