import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Config from "common/config.json";
import { Assembly } from "./Annotations";

const ASSEMBLY_CONFIG = {
  GRCh38: {
    img: "/Transparent_HumanIcon.png",
    title: "Human (GRCh38/hg38)",
    subtitle: "2,348,854 cCREs • 1,888 cell types",
    downloads: [
      {
        url: Config.Downloads.HumanCCREs,
        buttonLabel: "All Human cCREs (129.1 MB)",
      },
      {
        url: Config.Downloads.HumanCCREs,
        buttonLabel: "Human cCREs with Multimappers (XXX MB)",
      },
    ],
  },
  mm10: {
    img: "/Transparent_MouseIcon.png",
    title: "Mouse (GRCm38/mm10)",
    subtitle: "926,843 cCREs • 366 cell types",
    downloads: [
      {
        url: Config.Downloads.MouseCCREs,
        buttonLabel: "All Mouse cCREs (50.6 MB)",
      },
      {
        url: Config.Downloads.MouseCCREs,
        buttonLabel: "Mouse cCREs with Multimappers (XXX MB)",
      },
    ],
  },
} as const;

type AnnotationsHeaderProps = {
  assembly: Assembly;
};

const AnnotationsHeader: React.FC<AnnotationsHeaderProps> = ({ assembly }) => {
  const [open, setOpen] = useState(false);
  const config = ASSEMBLY_CONFIG[assembly];

  return (
    <Stack
      direction={"row"}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={2}
      flexWrap={"wrap"}
      display="flex"
      alignItems="center"
      gap={2}
      p={1}
    >
      <Box component="img" src={config.img} alt={config.title} sx={{ width: 72, height: 72 }} />
      <Stack flexGrow={1} spacing={0.5} minWidth={0}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {config.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {config.subtitle}
        </Typography>
      </Stack>
      <Stack spacing={0.5} minWidth={0}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          endIcon={<DownloadIcon />}
          sx={{ whiteSpace: "nowrap" }}
        >
          Download {assembly === "GRCh38" ? "Human cCREs" : "Mouse cCREs"}
        </Button>
        <Typography variant="body2" color="text.secondary" noWrap>
          Cite as: something about citing here
        </Typography>
      </Stack>
      <Dialog
        open={open}
        onClose={(event) => {
          (event as React.MouseEvent).stopPropagation();
          setOpen(false);
        }}
        aria-labelledby="export-dialog-title"
        disableScrollLock
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(2px)",
            },
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle id="export-dialog-title">
          Download cCREs in {assembly === "GRCh38" ? "Human (GRCh38/hg38)" : "Mouse (GRCm38/mm10)"}:
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", p: 0 }}>
          {config.downloads.map((opt, i) => (
            <React.Fragment key={opt.buttonLabel}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Typography variant="body1">
                  {opt.buttonLabel} {i === 0 && <strong>&nbsp;(Recommended)</strong>}
                </Typography>
                <IconButton component="a" href={opt.url} download aria-label={`Download ${opt.buttonLabel}`}>
                  <DownloadIcon />
                </IconButton>
              </Box>

              {i < config.downloads.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AnnotationsHeader;
