import { Chromosome, createBrowserStoreMemo, createTrackStoreMemo, Domain, Track } from "@weng-lab/genomebrowser";
import { tfPeaksTrack } from "@weng-lab/genomebrowser-ui";
import { AnyEntityType } from "common/entityTabsConfig";
import { GenomicRange } from "common/types/globalTypes";
import { useEffect, useMemo } from "react";
import { randomColor } from "../utils";
import { getLocalBrowser, getLocalTracks, setLocalBrowser, setLocalTracks } from "./getLocalStorage";
import { gwasTracks, injectCallbacks, TrackCallbacks } from "../TrackSelect/defaultTracks";

export type UseLocalBrowserParams = {
  /** The entity's id/name, used as the local storage key and the default highlight's id */
  name: string;
  assembly: string;
  /** The entity's own coordinates, highlighted so the feature stays visible within the padded view */
  entityCoordinates: GenomicRange;
  /**
   * The browser's starting view. Already padded by the caller - this hook deliberately does not
   * expand it, so that `expandCoordinates` is applied exactly once per browser (see
   * GenomeBrowserView).
   */
  browserDomain: Domain;
  type: AnyEntityType;
  breakpoint?: "sm" | "md";
};

/**
 * Pass entity name/id, coordinates and starting domain to get back the browser store.
 * Will first check local storage for any saved browser state before creating it from scratch.
 * @returns a browser store instance
 */
export function useLocalBrowser({
  name,
  assembly,
  entityCoordinates,
  browserDomain,
  type,
  breakpoint,
}: UseLocalBrowserParams) {
  const trackWidth = breakpoint === "sm" ? 550 : breakpoint === "md" ? 950 : 1450;

  const localBrowser = useMemo(() => getLocalBrowser(name, assembly), [name, assembly]);

  // potential infinite loop
  const browserStore = createBrowserStoreMemo(
    {
      domain: localBrowser?.domain != null ? localBrowser?.domain : browserDomain,
      highlights:
        localBrowser?.highlights ||
        (type !== "gwas" && [
          {
            color: randomColor(),
            domain: {
              chromosome: entityCoordinates.chromosome as Chromosome,
              start: entityCoordinates.start,
              end: entityCoordinates.end,
            },
            id: name,
            opacity: 0.2,
          },
        ]),
      trackWidth: trackWidth,
      marginWidth: 50,
      multiplier: 3,
    },
    [localBrowser]
  );

  // Responsive breakpoint handling
  const setTrackWidth = browserStore((s) => s.setTrackWidth);
  const setTitleSize = browserStore((s) => s.setTitleSize);
  const setFontSize = browserStore((s) => s.setFontSize);

  useEffect(() => {
    const titleSize = breakpoint === "sm" ? 18 : breakpoint === "md" ? 14 : 12;
    setTrackWidth(trackWidth);
    setTitleSize(titleSize);
    setFontSize(titleSize - 2);
  }, [breakpoint, trackWidth, setTrackWidth, setTitleSize, setFontSize]);

  const currentDomain = browserStore((state) => state.domain);
  const highlights = browserStore((state) => state.highlights);

  // Any time domain and highlights change, we update the local storage
  useEffect(() => {
    setLocalBrowser(name, assembly, { domain: currentDomain, highlights: highlights });
  }, [name, assembly, currentDomain, highlights]);

  return browserStore;
}

export function useLocalTracks(assembly: string, entitytype: AnyEntityType, callbacks?: TrackCallbacks) {
  const localTracks = getLocalTracks(assembly);

  // Start empty if no stored tracks - TrackSelect will populate defaults via initialSelection
  let initialTracks = localTracks || [];
  if (entitytype === "gwas") {
    initialTracks = gwasTracks;
  }
  // Rehydrate the tfPeaks custom track: functions (fetcher, renderers, tooltip, settingsPanel)
  // are lost on JSON serialization, so replace with the canonical object while preserving user settings
  initialTracks = initialTracks.map((t) => {
    if (t.id !== "custom-tf-peaks" && t.id !== "human-other-tracks/tf-peaks") return t;
    const stale = t as unknown as Record<string, unknown>;
    return {
      ...tfPeaksTrack,
      id: t.id,
      filter: stale.filter as string[] | undefined,
      color: (stale.color as string) ?? tfPeaksTrack.color,
      height: (stale.height as number) ?? tfPeaksTrack.height,
      displayMode: (stale.displayMode as typeof tfPeaksTrack.displayMode) ?? tfPeaksTrack.displayMode,
      title: (stale.title as string) ?? tfPeaksTrack.title,
      baseColor: (stale.baseColor as string) ?? tfPeaksTrack.baseColor,
      overlayColor: (stale.overlayColor as string) ?? tfPeaksTrack.overlayColor,
    } as Track;
  });
  // Inject callbacks if provided (callbacks are lost on JSON serialization)
  if (callbacks) {
    initialTracks = initialTracks.map((t) => injectCallbacks(t, callbacks));
  }

  const trackStore = createTrackStoreMemo(initialTracks, []);
  const tracks = trackStore((state) => state.tracks);

  // any time the track list changes, update local storage
  useEffect(() => {
    if (entitytype === "gwas") return;
    setLocalTracks(tracks, assembly);
  }, [tracks, assembly, entitytype]);

  return trackStore;
}
