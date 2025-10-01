import { RegistryBiosample } from "common/components/BiosampleTables/types";
import ConfigureGenomeBrowser from "./ConfigureGenomeBrowser";
import { Dialog } from "@mui/material";
import { isNullish } from "@apollo/client/cache/inmemory/helpers";

interface Props {
  assembly: "mm10" | "GRCh38";
  open: boolean;
  multiselect?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBiosampleSelect: (biosample: RegistryBiosample | RegistryBiosample[] | null) => void;
  selectedBiosamples?: RegistryBiosample[] | null;
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
