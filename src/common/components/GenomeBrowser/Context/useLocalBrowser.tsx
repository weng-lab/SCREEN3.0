import { Chromosome, createBrowserStoreMemo, createTrackStoreMemo, InitialBrowserState } from "@weng-lab/genomebrowser";
import { AnyEntityType } from "common/entityTabsConfig";
import { GenomicRange } from "common/types/globalTypes";
import { useEffect, useMemo } from "react";
import { expandCoordinates, randomColor } from "../utils";
import { getLocalBrowser, getLocalTracks, setLocalBrowser, setLocalTracks } from "./getLocalStorage";
import { gwasTracks, injectCallbacks, TrackCallbacks } from "../TrackSelect/defaultTracks";

/**
 * Pass entity name/id and coordinates to get back the browser and track stores.
 * Will first check local storage for any saved browser and track state before
 * re-creating them from scratch.
 * @param name the entity's id/name
 * @param coordinates the entity's genomic coordinates
 * @returns a browser store instance
 */
export function useLocalBrowser(name: string, assembly: string, coordinates: GenomicRange, type: AnyEntityType) {
  const localBrowser = useMemo(() => getLocalBrowser(name, assembly), [name, assembly]);

  // initialize the current domain, if not already saved
  const currentDomain =
    localBrowser?.domain != null
      ? localBrowser?.domain
      : expandCoordinates(
          {
            chromosome: coordinates.chromosome as Chromosome,
            start: coordinates.start,
            end: coordinates.end,
          },
          type
        );
  const initialBrowserState: InitialBrowserState = {
    domain: currentDomain,
    highlights:
      localBrowser?.highlights ||
      (type !== "gwas" && [
        {
          color: randomColor(),
          domain: {
            chromosome: coordinates.chromosome as Chromosome,
            start: coordinates.start,
            end: coordinates.end,
          },
          id: name,
          opacity: 0.2,
        },
      ]),
    trackWidth: 1400,
    marginWidth: 100,
    multiplier: 3,
  };

  // potential infinite loop
  const browserStore = createBrowserStoreMemo(initialBrowserState, [localBrowser]);

  const domain = browserStore((state) => state.domain);
  const highlights = browserStore((state) => state.highlights);

  // Any time domain and highlights change, we update the local storage
  useEffect(() => {
    setLocalBrowser(name, assembly, { domain: domain, highlights: highlights });
  }, [name, assembly, domain, highlights]);

  return browserStore;
}

export function useLocalTracks(assembly: string, entitytype: AnyEntityType, callbacks?: TrackCallbacks) {
  const localTracks = getLocalTracks(assembly);

  // Start empty if no stored tracks - TrackSelect will populate defaults via initialSelection
  let initialTracks = localTracks || [];
  if (entitytype === "gwas") {
    initialTracks = gwasTracks;
  }
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
