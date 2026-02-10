import { Download } from "@mui/icons-material";
import { Modal, Typography, IconButton, Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { trackDownload } from "../analytics";
import { Selected } from "./AssemblyControls";
import Config from "common/config.json";

type DownloadModalProps = {
  openModal: boolean;
  handleCloseModal: () => void;
  selectedAssay: Selected;
};

// Styling for download modal
const downloadStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "15%",
  boxShadow: 24,
  padding: "16px",
  bgcolor: "background.paper",
  borderRadius: "8px",
};

/**
 *
 * @param selectedAssay The selected assembly & assay
 * @param variant "signal" or "zScore"
 * @returns The corresponding download URL
 */
const matrixDownloadURL = (selectedAssay: Selected, variant: "signal" | "zScore") => {
  const matrices = {
    Human: {
      signal: {
        DNase: Config.Downloads.HumanDNaseSignalMatrix,
        H3K4me3: Config.Downloads.HumanPromoterSignalMatrix,
        H3K27ac: Config.Downloads.HumanEnhancerSignalMatrix,
        CTCF: Config.Downloads.HumanCTCFSignalMatrix,
      },
      zScore: {
        DNase: Config.Downloads.HumanDNaseZScoreMatrix,
        H3K4me3: Config.Downloads.HumanPromoterZScoreMatrix,
        H3K27ac: Config.Downloads.HumanEnhancerZScoreMatrix,
        CTCF: Config.Downloads.HumanCTCFZScoreMatrix,
      },
    },
    Mouse: {
      signal: {
        DNase: Config.Downloads.MouseDNaseSignalMatrix,
        H3K4me3: Config.Downloads.MousePromoterSignalMatrix,
        H3K27ac: Config.Downloads.MouseEnhancerSignalMatrix,
        CTCF: Config.Downloads.MouseCTCFSignalMatrix,
      },
      zScore: {
        DNase: Config.Downloads.MouseDNaseZScoreMatrix,
        H3K4me3: Config.Downloads.MousePromoterZScoreMatrix,
        H3K27ac: Config.Downloads.MouseEnhancerZScoreMatrix,
        CTCF: Config.Downloads.MouseCTCFZScoreMatrix,
      },
    },
  };
  return matrices[selectedAssay.assembly][variant][selectedAssay.assay];
};

const DownloadModal = (props: DownloadModalProps) => {
  const { openModal, handleCloseModal, selectedAssay } = props;
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="download-modal-title"
      aria-describedby="download-modal-description"
    >
      <Box sx={downloadStyle}>
        <Typography id="download-modal-title" variant="h6">
          Download
        </Typography>
        <Typography id="download-modal-description" variant="subtitle1" sx={{ mt: 1 }}>
          Select format to download
        </Typography>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <IconButton
                color="primary"
                onClick={() => {
                  const url = matrixDownloadURL(selectedAssay, "signal");
                  const fileName =
                    selectedAssay.assay === "DNase"
                      ? "Read-Depth Normalized Signal Matrix"
                      : "Fold-Change Signal Matrix";
                  trackDownload(
                    url,
                    `${selectedAssay.assembly}-${selectedAssay.assay}-${fileName}`,
                    "data-matrices",
                    selectedAssay.assembly
                  );
                  window.location.href = url;
                }}
              >
                <Download />
              </IconButton>
              <Typography>
                {selectedAssay.assay === "DNase" ? "Read-Depth Normalized Signal Matrix" : "Fold-Change Signal Matrix"}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center">
              <IconButton
                color="primary"
                onClick={() => {
                  const url = matrixDownloadURL(selectedAssay, "zScore");
                  trackDownload(
                    url,
                    `${selectedAssay.assembly}-${selectedAssay.assay}-Z-Score Matrix`,
                    "data-matrices",
                    selectedAssay.assembly
                  );
                  window.location.href = url;
                }}
              >
                <Download />
              </IconButton>
              <Typography>Z-Score Matrix</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button sx={{ textTransform: "none" }} onClick={handleCloseModal}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DownloadModal;
