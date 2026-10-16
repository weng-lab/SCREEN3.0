import { createBrowserStore, createTrackStore, type GenomicRegion } from "@weng-lab/genomebrowser";
import { assemblies } from "common/assemblies";
import type { AnyEntityType } from "common/entityTabsConfig";
import type { Assembly, GenomicRange } from "common/types/globalTypes";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { randomColor } from "../utils";
import {
  getLocalBrowser,
  getLocalTracks,
  setLocalBrowser,
  setLocalTracks,
  durableHighlights,
  sameBrowserState,
} from "./getLocalStorage";
import {
  gwasTracks,
  injectCallbacks,
  RULER_TRACK_ID,
  withReferenceTracks,
  type TrackCallbacks,
} from "../TrackSelect/defaultTracks";
import { createScreenModules } from "../modules/registry";
import { catalogEntries, defaultTrackIds, defaultGeneTrackId } from "../TrackSelect/collections";

export type UseLocalBrowserParams = {
  name: string;
  assembly: Assembly;
  entityCoordinates: GenomicRange;
  browserDomain: GenomicRegion;
  type: AnyEntityType;
};
export function useLocalBrowser({ name, assembly, entityCoordinates, browserDomain, type }: UseLocalBrowserParams) {
  const useStore = useMemo(() => {
    const initial = {
      assembly: assemblies[assembly].browserAssembly,
      region: browserDomain,
      marginWidth: 50,
      highlights: type === "gwas" ? [] : [{ color: "#e41a1c", region: entityCoordinates, id: name, opacity: 0.2 }],
    };
    return createBrowserStore(initial);
    // Starting coordinates seed a session, not every render; GWAS region changes are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, assembly, type]);
  // Hydrate with the same defaults as the server, then restore before persistence starts.
  useLayoutEffect(() => {
    const saved = getLocalBrowser(name, assembly);
    useStore.setState(
      saved ?? {
        highlights: useStore.getInitialState().highlights.map((highlight) => ({ ...highlight, color: randomColor() })),
      }
    );
  }, [name, assembly, useStore]);
  useEffect(() => {
    const snapshot = () => {
      const { region, highlights } = useStore.getState();
      return { region, highlights: durableHighlights(highlights) };
    };
    let previousSaved = snapshot();
    const save = () => {
      const next = snapshot();
      if (sameBrowserState(previousSaved, next)) return;
      setLocalBrowser(name, assembly, next);
      previousSaved = next;
    };
    setLocalBrowser(name, assembly, previousSaved);
    return useStore.subscribe((state, previous) => {
      if (state.region !== previous.region || state.highlights !== previous.highlights) save();
    });
  }, [name, assembly, useStore]);
  return useStore;
}

export function useLocalTracks(assembly: Assembly, type: AnyEntityType, studyId: string, callbacks: TrackCallbacks) {
  const useStore = useMemo(() => {
    const modules = createScreenModules(assembly);
    const empty = createTrackStore({ modules });
    const ids = new Set(defaultTrackIds(assembly));
    const defaults = () =>
      type === "gwas"
        ? gwasTracks(studyId)
        : catalogEntries(assembly).flatMap((e) =>
            ids.has(e.base.id)
              ? [empty.getState().registry.get(e.type).create({ base: e.base, config: e.config, source: "host" })]
              : []
          );
    const defaultTracks = defaults();
    const geneId = type === "gwas" ? "screen-gwas-genes" : defaultGeneTrackId(assembly);
    const gene = defaultTracks.find((track) => track.base.id === geneId)!;
    const pinnedTrackIds = [RULER_TRACK_ID, geneId];
    return createTrackStore({ modules, pinnedTrackIds, tracks: withReferenceTracks(defaultTracks, gene, assembly) });
  }, [assembly, type, studyId]);
  useLayoutEffect(() => {
    if (type === "gwas") return;
    const state = useStore.getState();
    const saved = getLocalTracks(assembly, state.registry);
    if (!saved) return;
    const gene = useStore.getInitialState().tracks.find((track) => track.base.id === defaultGeneTrackId(assembly))!;
    try {
      state.setTracks(withReferenceTracks(saved, gene, assembly));
    } catch {
      // Keep the defaults if saved reference tracks no longer validate.
    }
  }, [assembly, type, useStore]);
  // Rebind application interactions without recreating the entity's track state.
  useLayoutEffect(() => {
    const state = useStore.getState();
    // Only interactions change; preserve validated config/base identities and track order.
    useStore.setState({ tracks: state.tracks.map((track) => injectCallbacks(track, callbacks)) });
  }, [useStore, callbacks]);
  useEffect(() => {
    if (type === "gwas") return;
    const save = () => setLocalTracks(useStore.getState().tracks, assembly);
    save();
    return useStore.subscribe((state, previous) => {
      if (state.tracks === previous.tracks) return;
      const unchanged =
        state.tracks.length === previous.tracks.length &&
        state.tracks.every((track, i) => {
          const old = previous.tracks[i];
          return (
            track.type === old.type &&
            track.source === old.source &&
            track.base === old.base &&
            track.config === old.config
          );
        });
      if (!unchanged) save();
    });
  }, [assembly, type, useStore]);
  return useStore;
}
