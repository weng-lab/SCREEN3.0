import MyLocationIcon from "@mui/icons-material/MyLocation";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { createTheme, ThemeProvider, type Theme } from "@mui/material/styles";
import type { BrowserStoreInstance, TrackStoreInstance } from "@weng-lab/genomebrowser";
import { ControlToolbar, HighlightDialog } from "@weng-lab/genomebrowser-ui";
import type { Assembly } from "common/types/globalTypes";
import type { TrackCallbacks } from "../TrackSelect/defaultTracks";
import TrackSelectModal from "../TrackSelect/TrackSelectModal";

// Menu scroll locking changes the responsive browser's width and redraws its tracks.
const toolbarTheme = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiSelect: { defaultProps: { MenuProps: { disableScrollLock: true } } },
    },
  });

export default function BrowserControls({
  browserStore,
  trackStore,
  assembly,
  callbacks,
  canSelectTracks,
  onRecenter,
  recenterLabel,
  onSelectLDBlock,
}: {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  assembly: Assembly;
  callbacks: TrackCallbacks;
  canSelectTracks: boolean;
  onRecenter?: () => void;
  recenterLabel: string;
  onSelectLDBlock?: () => void;
}) {
  const [highlightsOpen, setHighlightsOpen] = useState(false);
  const [tracksOpen, setTracksOpen] = useState(false);

  return (
    <>
      <ThemeProvider theme={toolbarTheme}>
        <ControlToolbar
          browserStore={browserStore}
          search={{ assembly, graphqlUrl: "/api/graphql", queries: ["Gene", "SNP", "cCRE", "Coordinate"] }}
          navigationActions={
            onRecenter && (
              <Tooltip title={recenterLabel} describeChild>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<MyLocationIcon fontSize="small" />}
                  onClick={onRecenter}
                  sx={{ height: 32 }}
                >
                  Recenter
                </Button>
              </Tooltip>
            )
          }
          managementActions={
            onSelectLDBlock && (
              <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={onSelectLDBlock}>
                Select LD Block
              </Button>
            )
          }
          onManageHighlights={() => setHighlightsOpen(true)}
          onSelectTracks={canSelectTracks ? () => setTracksOpen(true) : undefined}
        />
      </ThemeProvider>
      <HighlightDialog browserStore={browserStore} open={highlightsOpen} onClose={() => setHighlightsOpen(false)} />
      {tracksOpen && (
        <TrackSelectModal
          trackStore={trackStore}
          assembly={assembly}
          callbacks={callbacks}
          onClose={() => setTracksOpen(false)}
        />
      )}
    </>
  );
}
