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
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface Props {
  ldblock: { ldblock: number; chromosome: string; start: number; end: number };
  ldblockList: { ldblock: number; chromosome: string; start: number; end: number }[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLdBlockSelect: (ldblock: { ldblock: number; chromosome: string; start: number; end: number }) => void;
}

const SelectLdBlock = ({ ldblock, ldblockList, open, setOpen, onLdBlockSelect }: Props) => {
  const [selectedldblock, setSelectedLdBlock] = useState(JSON.stringify(ldblock));

  useEffect(() => {
    if (open && ldblock) {
      setSelectedLdBlock(JSON.stringify(ldblock));
    }
  }, [open, ldblock]);

  const handleSubmit = () => {
    onLdBlockSelect(JSON.parse(selectedldblock)); // send to parent
    setOpen(false); // close dialog
  };
  return (
    <Dialog open={open} onClose={() => setOpen(false)} disableRestoreFocus>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <DialogTitle>Select LD Block</DialogTitle>
        <IconButton size="large" onClick={() => setOpen(false)} sx={{ mr: 1 }}>
          <CloseOutlined fontSize="inherit" />
        </IconButton>
      </Stack>
      <DialogContent>
        <RadioGroup value={selectedldblock} onChange={(e) => setSelectedLdBlock(e.target.value)}>
          {ldblockList.map((m) => (
            <FormControlLabel
              key={m.ldblock}
              value={JSON.stringify(m)}
              control={<Radio />}
              label={
                <span>
                  {m.ldblock}{" "}
                  <Typography component="span" variant="body2" color="text.secondary">
                    ({m.chromosome}:{m.start}-{m.end})
                  </Typography>
                </span>
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

export default SelectLdBlock;
