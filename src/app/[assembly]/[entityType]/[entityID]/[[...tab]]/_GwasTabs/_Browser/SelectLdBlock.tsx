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
import { useState } from "react";
import type { LdBlock } from "common/hooks/data/gwas";

interface Props {
  /** The block currently applied to the browser. The dialog opens with this one selected */
  ldblock: LdBlock | null;
  ldblockList: LdBlock[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLdBlockSelect: (ldblock: LdBlock) => void;
}

const SelectLdBlock = ({ ldblock, ldblockList, open, setOpen, onLdBlockSelect }: Props) => {
  const handleSubmit = (selected: LdBlock) => {
    onLdBlockSelect(selected); // send to parent
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
      {/* Dialog unmounts its children while closed, so the picker remounts on every open and its
          selection always starts from the applied block. That is what discards a selection the user
          made but never submitted, without needing an effect to re-sync it. */}
      <LdBlockPicker applied={ldblock} ldblockList={ldblockList} onSubmit={handleSubmit} />
    </Dialog>
  );
};

const LdBlockPicker = ({
  applied,
  ldblockList,
  onSubmit,
}: {
  applied: LdBlock | null;
  ldblockList: LdBlock[];
  onSubmit: (ldblock: LdBlock) => void;
}) => {
  // The radio value is the block number rather than a serialized block, so the selection stays a
  // plain id and the block itself is looked up once on submit
  const [selectedId, setSelectedId] = useState(applied ? String(applied.ldblock) : "");
  const selected = ldblockList.find((m) => String(m.ldblock) === selectedId);

  return (
    <>
      <DialogContent>
        <RadioGroup value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {ldblockList.map((m) => (
            <FormControlLabel
              key={m.ldblock}
              value={String(m.ldblock)}
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
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
        >
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

export default SelectLdBlock;
