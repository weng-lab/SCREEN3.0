import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  DialogActions,
  Button,
  Stack,
  Tooltip,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  method: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onMethodSelect: (method: string) => void;
}

const methodDescriptions = {
  "ABC_(DNase_only)": "Activity-By-Contact model using DNase data only",
  "ABC_(full)": "Activity-By-Contact model using DNase, histone marks, and other signals",
  EPIraction: "Predicts enhancer–promoter interactions using regression on chromatin features",
  GraphRegLR: "Graph attention network trained on 2 Mb genomic bins",
  "rE2G_(DNase_only)": "Regulatory Element to Gene mapping using DNase data only",
  "rE2G_(extended)": "Extended Regulatory Element to Gene mapping using multiple features",
};

const SelectCompuGenesMethod: React.FC<Props> = ({ method, open, setOpen, onMethodSelect }) => {
  const [selectedmethod, setSelectedMethod] = useState<string>(method);
  const methods = [
    "ABC_(DNase_only)",
    "ABC_(full)",
    "EPIraction",
    "GraphRegLR",
    "rE2G_(DNase_only)",
    "rE2G_(extended)",
  ];

  const handleSubmit = () => {
    onMethodSelect(selectedmethod); // send to parent
    setOpen(false); // close dialog
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <DialogTitle>Select Computational Gene Linking Method</DialogTitle>
        <IconButton size="large" onClick={() => setOpen(false)} sx={{ mr: 1 }}>
          <CloseOutlined fontSize="inherit" />
        </IconButton>
      </Stack>
      <DialogContent>
        <RadioGroup value={selectedmethod} onChange={(e) => setSelectedMethod(e.target.value)}>
          {methods.map((m) => (
            <FormControlLabel
              key={m}
              value={m}
              control={<Radio />}
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <span>{m.replaceAll("_", " ")}</span>
                  <Tooltip title={methodDescriptions[m]}>
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button sx={{ textTransform: "none" }} variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCompuGenesMethod;
