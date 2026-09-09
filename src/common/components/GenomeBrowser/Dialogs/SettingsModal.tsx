import { Box, Portal } from "@mui/material";
import { createSettingsStore, type SettingsModalProps } from "@weng-lab/genomebrowser";

// The default shell is exposed through the settings store, not as a package export.
const PackageSettingsModal = createSettingsStore().getState().modalComponent;

export default function SettingsModal(props: SettingsModalProps) {
  return (
    <Portal>
      <Box sx={{ position: "relative", zIndex: (theme) => theme.zIndex.modal }}>
        <PackageSettingsModal {...props} />
      </Box>
    </Portal>
  );
}
