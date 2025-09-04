import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { CancelRounded, Close } from "@mui/icons-material";
import { RegistryBiosample } from "app/_biosampleTables/types";

export default function BiosampleDisplay({
  biosamples,
  onBiosampleDeselect,
}: {
  biosamples: RegistryBiosample[] | null;
  onBiosampleDeselect: (biosamples: RegistryBiosample[] | null) => void
}) {
  const [open, setOpen] = useState(false);

  if (!biosamples || biosamples.length === 0) return null;

  const handleBisoampleDeselect = (biosample: RegistryBiosample) => {
    const updated = biosamples.filter((b) => b.name !== biosample.name);
    onBiosampleDeselect(updated.length > 0 ? updated : null);
  }

  return (
    <>
      <Button
        variant="outlined"
        sx={{ textTransform: "none", alignSelf: "flex-start" }}
        onClick={() => setOpen(true)}
      >
        Selected Biosamples ({biosamples.length})
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <DialogTitle>Selected Biosamples</DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Stack>

        <DialogContent dividers>
          <Stack spacing={1}>
            {biosamples.map((sample) => (
              <Stack
                key={sample.name}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  backgroundColor: (theme) => theme.palette.secondary.light,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                }}
              >
                <Typography sx={{ color: "#2C5BA0" }}>
                  {sample.ontology.charAt(0).toUpperCase() +
                    sample.ontology.slice(1)}{" "}
                  - {sample.displayname}
                </Typography>
                <IconButton size="small" onClick={() => handleBisoampleDeselect(sample)}>
                  <CancelRounded fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
