import { Button } from "@mui/material";
import HighlightIcon from "@mui/icons-material/Highlight";
import { HighlightDialog as BrowserHighlightDialog } from "@weng-lab/genomebrowser-ui";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { useState } from "react";
export default function HighlightDialog({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        startIcon={<HighlightIcon />}
        size="small"
        onClick={() => setOpen(true)}
        sx={{ minHeight: 44 }}
      >
        Highlights
      </Button>
      <BrowserHighlightDialog browserStore={browserStore} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
