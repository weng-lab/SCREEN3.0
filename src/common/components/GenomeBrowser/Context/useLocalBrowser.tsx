import {
  createBrowserStore,
  createTrackStore,
  createTrackFromEntry,
  hg38,
  mm10,
  type GenomicRegion,
} from "@weng-lab/genomebrowser";
import type { AnyEntityType } from "common/entityTabsConfig";
import type { Assembly, GenomicRange } from "common/types/globalTypes";
import { useEffect, useMemo } from "react";
import { randomColor } from "../utils";
import { getLocalBrowser, getLocalTracks, setLocalBrowser, setLocalTracks } from "./getLocalStorage";
import { gwasTracks, injectCallbacks, type TrackCallbacks } from "../TrackSelect/defaultTracks";
import { createScreenModules } from "../modules/registry";
import { catalogEntries, defaultTrackIds } from "../TrackSelect/collections";

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
      assembly: assembly === "GRCh38" ? hg38 : mm10,
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
    const save = () => {
      const { region, highlights } = useStore.getState();
      setLocalBrowser(name, assembly, { region, highlights });
    };
    save();
    return useStore.subscribe(save);
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
    const saved = type === "gwas" ? null : getLocalTracks(assembly);
    try {
      return createTrackStore({ modules, tracks: (saved ?? defaults()).map((t) => injectCallbacks(t, callbacks)) });
    } catch {
      return createTrackStore({ modules, tracks: defaults().map((t) => injectCallbacks(t, callbacks)) });
    }
  }, [assembly, type, studyId, callbacks]);
  useEffect(() => {
    if (type === "gwas") return;
    const save = () => setLocalTracks(useStore.getState().tracks, assembly);
    save();
    return useStore.subscribe(save);
  }, [assembly, type, useStore]);
  return useStore;
}
