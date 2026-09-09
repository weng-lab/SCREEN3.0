import {
  createBrowserStore,
  createTrackStore,
  createTrackFromEntry,
  type GenomicRegion,
} from "@weng-lab/genomebrowser";
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
  breakpoint?: "sm" | "md";
};
export function useLocalBrowser({
  name,
  assembly,
  entityCoordinates,
  browserDomain,
  type,
  breakpoint,
}: UseLocalBrowserParams) {
  const trackWidth = breakpoint === "sm" ? 550 : breakpoint === "md" ? 950 : 1450;
  const useStore = useMemo(() => {
    const initial = {
      assembly: assemblies[assembly].browserAssembly,
      region: browserDomain,
      trackWidth,
      marginWidth: 50,
      highlights: type === "gwas" ? [] : [{ color: randomColor(), region: entityCoordinates, id: name, opacity: 0.2 }],
    };
    const saved = getLocalBrowser(name, assembly);
    try {
      return createBrowserStore({ ...initial, ...saved });
    } catch {
      return createBrowserStore(initial);
    }
    // Starting coordinates seed a session, not every render; GWAS region changes are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, assembly, type]);
  useEffect(() => {
    const titleSize = breakpoint === "sm" ? 18 : breakpoint === "md" ? 14 : 12;
    useStore.setState({ titleSize, fontSize: titleSize - 2 });
  }, [breakpoint, useStore]);
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
            ids.has(e.id) ? [createTrackFromEntry(empty.getState().registry, { ...e, source: "host" })] : []
          );
    const saved = type === "gwas" ? null : getLocalTracks(assembly, empty.getState().registry);
    const defaultTracks = defaults();
    const geneId = type === "gwas" ? "screen-gwas-genes" : defaultGeneTrackId(assembly);
    const gene = defaultTracks.find((track) => track.base.id === geneId)!;
    const pinnedTrackIds = [RULER_TRACK_ID, geneId];
    try {
      return createTrackStore({
        modules,
        pinnedTrackIds,
        tracks: withReferenceTracks(saved ?? defaultTracks, gene, assembly),
      });
    } catch {
      return createTrackStore({ modules, pinnedTrackIds, tracks: withReferenceTracks(defaultTracks, gene, assembly) });
    }
  }, [assembly, type, studyId]);
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
