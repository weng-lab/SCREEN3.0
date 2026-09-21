import { Alert } from "@mui/material";
import { createTheme, ThemeProvider, type Theme } from "@mui/material/styles";
import { createTrackStore, type TrackStoreInstance } from "@weng-lab/genomebrowser";
import { TrackSelect } from "@weng-lab/genomebrowser-ui";
import { useMemo, useState } from "react";
import type { Assembly } from "common/types/globalTypes";
import { injectCallbacks, withReferenceTracks, type TrackCallbacks } from "./defaultTracks";
import { catalogEntries, collectionsByAssembly, defaultTrackIds, defaultGeneTrackId } from "./collections";
import { createScreenModules } from "../modules/registry";
import { CHROMHMM_TRACK_ID, combineChromHmm, expandChromHmm } from "./trackState";

// Collection views require grouping, which SCREEN disables in the global theme.
const trackSelectTheme = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiDataGrid: {
        defaultProps: { disableRowGrouping: false },
      },
    },
  });

export default function TrackSelectModal({
  trackStore,
  assembly,
  callbacks,
  onClose,
}: {
  trackStore: TrackStoreInstance;
  assembly: Assembly;
  callbacks: TrackCallbacks;
  onClose: () => void;
}) {
  const [selectionStore] = useState(() =>
    createTrackStore({
      modules: createScreenModules(assembly),
      tracks: expandChromHmm(trackStore.getState().tracks, assembly, trackStore.getState().registry),
    })
  );
  const defaults = useMemo(() => defaultTrackIds(assembly), [assembly]);
  const initialIds = useMemo(() => {
    const known = new Set(catalogEntries(assembly).map((entry) => entry.base.id));
    return (
      selectionStore?.getState().tracks.flatMap((track) => (known.has(track.base.id) ? [track.base.id] : [])) ?? []
    );
  }, [selectionStore, assembly]);
  const [error, setError] = useState<string>();
  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {selectionStore && (
        <ThemeProvider theme={trackSelectTheme}>
          <TrackSelect
            open
            onClose={onClose}
            trackCollections={collectionsByAssembly[assembly]}
            useTrackStore={selectionStore}
            initialTrackIds={initialIds}
            defaultTrackIds={defaults}
            maxTracks={30}
            title="Track Selection"
            onCommittedTrackIds={() => {
              const selectedTracks = combineChromHmm(
                selectionStore.getState().tracks,
                assembly,
                trackStore.getState().getTrack(CHROMHMM_TRACK_ID)
              ).map((t) => injectCallbacks(t, callbacks));
              const gene = trackStore.getState().getTrack(defaultGeneTrackId(assembly));
              const tracks = gene ? withReferenceTracks(selectedTracks, gene, assembly) : selectedTracks;
              const result = trackStore.getState().setTracks(tracks);
              if (result.ok === false) setError(result.error);
            }}
          />
        </ThemeProvider>
      )}
    </>
  );
}
