import { RegistryBiosample } from "app/_biosampleTables/types";
import ConfigureGenomeBrowser from "./ConfigureGenomeBrowser";
import { Dialog } from "@mui/material";

interface Props {
  assembly: "mm10" | "GRCh38";
  open: boolean;
  multiselect?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBiosampleSelect: (biosample: RegistryBiosample | RegistryBiosample[] | null) => void;
}

const ConfigureGBModal: React.FC<Props> = ({ assembly, open, multiselect, setOpen, onBiosampleSelect }) => {
  const allowMultiSelect = multiselect ? multiselect : false;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus>
      <ConfigureGenomeBrowser assembly={assembly} multiselect={multiselect} handleClose={() => setOpen(false)} onBiosampleSelect={onBiosampleSelect}
       />
    </Dialog>
  );
};

export default ConfigureGBModal;
