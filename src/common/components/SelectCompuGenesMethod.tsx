

import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, IconButton, DialogActions, Button, Stack } from "@mui/material";
import { Close, CloseOutlined } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  method: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onMethodSelect: (method: string) => void;

}

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
        setOpen(false) // close dialog
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
        <RadioGroup
          value={selectedmethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          {methods.map((m) => (
            <FormControlLabel
              key={m}
              value={m}
              control={<Radio />}
              label={m}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions >
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectCompuGenesMethod;
