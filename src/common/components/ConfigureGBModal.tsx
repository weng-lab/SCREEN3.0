import { RegistryBiosample } from "app/_biosampleTables/types";
import ConfigureGenomeBrowser from "./ConfigureGenomeBrowser";
import { Dialog } from "@mui/material";

interface Props {
  assembly: "mm10" | "GRCh38";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBiosampleSelect: (biosample: RegistryBiosample | null) => void;

}

const ConfigureGBModal: React.FC<Props> = ({ assembly, open, setOpen, onBiosampleSelect }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus>
      <ConfigureGenomeBrowser assembly={assembly} handleClose={() => setOpen(false)} onBiosampleSelect={onBiosampleSelect}
       />
    </Dialog>
  );
};

export default ConfigureGBModal;
