import { Add, Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { ChromHmmTissues } from "common/hooks/useChromHmmData";
import { capitalizeFirstLetter } from "common/utility";
import { SetStateAction } from "react";

export const ChromHmmDialog = ({
  open,
  setOpen,
  selectedChromHmmTissues,
  setSelectedChromHmmTissues,
}: {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  selectedChromHmmTissues: string[];
  setSelectedChromHmmTissues: (value: SetStateAction<string[]>) => void;
}) => {
  const notSelected = ChromHmmTissues.filter((tissue) => !selectedChromHmmTissues.includes(tissue));

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      disableRestoreFocus
      // sx={{ "& .MuiDialog-paper": { maxWidth: "none" } }}
    >
      <DialogTitle>Select ChromHMM Bulk Bed Tracks</DialogTitle>
      <DialogContent>
        <div>
          <Typography mt={2}>Selected:</Typography>
          {selectedChromHmmTissues.length ? (
            selectedChromHmmTissues?.map((tissue, i) => {
              return (
                <Stack mt={1} direction="row" alignItems={"center"} key={i}>
                  <IconButton
                    onClick={() => setSelectedChromHmmTissues(selectedChromHmmTissues.filter((x) => x !== tissue))}
                  >
                    <Close />
                  </IconButton>
                  <Typography>{capitalizeFirstLetter(tissue)}</Typography>
                </Stack>
              );
            })
          ) : (
            <Typography>None</Typography>
          )}
        </div>
        <div>
          <Typography mt={2}>Available:</Typography>
          {notSelected?.map((tissue, i) => {
            return (
              <Stack mt={1} direction="row" alignItems={"center"} key={i}>
                <IconButton onClick={() => setSelectedChromHmmTissues((prev) => [...prev, tissue])}>
                  <Add />
                </IconButton>
                <Typography>{capitalizeFirstLetter(tissue)}</Typography>
              </Stack>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
