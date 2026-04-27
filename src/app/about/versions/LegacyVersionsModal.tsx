"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useState } from "react";
import LegacyVersionsTable from "common/components/LegacyVersionsTable";

const LegacyVersionsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button startIcon={<InfoOutlinedIcon />} variant="outlined" onClick={() => setOpen(true)}>
        Legacy Releases
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 6 }}>
          Legacy Releases
          <IconButton
            aria-label="Close legacy releases"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ overflowX: "auto" }}>
            <LegacyVersionsTable />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LegacyVersionsModal;
