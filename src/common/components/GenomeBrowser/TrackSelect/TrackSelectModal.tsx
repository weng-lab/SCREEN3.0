import EditIcon from "@mui/icons-material/Edit";
import { Alert, Button } from "@mui/material";
import { createTrackStore, type TrackStoreInstance } from "@weng-lab/genomebrowser";
import { TrackSelect } from "@weng-lab/genomebrowser-ui";
import { useMemo, useState } from "react";
import type { Assembly } from "common/types/globalTypes";
import { injectCallbacks, type TrackCallbacks } from "./defaultTracks";
import { catalogEntries, collectionsByAssembly, defaultTrackIds } from "./collections";
import { createScreenModules } from "../modules/registry";
import { CHROMHMM_TRACK_ID, combineChromHmm, expandChromHmm } from "./trackState";

export default function TrackSelectModal({
  trackStore,
  assembly,
  callbacks,
}: {
  trackStore: TrackStoreInstance;
  assembly: Assembly;
  callbacks: TrackCallbacks;
}) {
  const [selectionStore, setSelectionStore] = useState<TrackStoreInstance>();
  const defaults = useMemo(() => defaultTrackIds(assembly), [assembly]);
  const initialIds = useMemo(() => {
    const known = new Set(catalogEntries(assembly).map((entry) => entry.id));
    return (
      selectionStore
        ?.getState()
        .tracks.map((track) => track.base.id)
        .filter((id) => known.has(id)) ?? []
    );
  }, [selectionStore, assembly]);
  const [error, setError] = useState<string>();
  const open = () => {
    const store = createTrackStore({
      modules: createScreenModules(assembly),
      tracks: expandChromHmm(trackStore.getState().tracks, assembly, trackStore.getState().registry),
    });
    setError(undefined);
    setSelectionStore(() => store);
  };
  return (
    <>
      <Button variant="contained" startIcon={<EditIcon />} size="small" onClick={open} sx={{ minHeight: 44 }}>
        Select Tracks
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
      {selectionStore && (
        <TrackSelect
          open
          onClose={() => setSelectionStore(undefined)}
          trackCollections={collectionsByAssembly[assembly]}
          useTrackStore={selectionStore}
          initialTrackIds={initialIds}
          defaultTrackIds={defaults}
          maxTracks={30}
          title="Track Selection"
          onCommittedTrackIds={() => {
            const tracks = combineChromHmm(
              selectionStore.getState().tracks,
              assembly,
              trackStore.getState().getTrack(CHROMHMM_TRACK_ID)
            ).map((t) => injectCallbacks(t, callbacks));
            const result = trackStore.getState().setTracks(tracks);
            if (result.ok === false) setError(result.error);
          }}
        />
      )}
    </>
  );
}
