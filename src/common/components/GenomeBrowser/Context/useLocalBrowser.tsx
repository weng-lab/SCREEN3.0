import { Chromosome, createBrowserStoreMemo, createTrackStoreMemo } from "@weng-lab/genomebrowser";
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
export function useLocalBrowser(
  name: string,
  assembly: string,
  coordinates: GenomicRange,
  type: AnyEntityType,
  breakpoint?: "sm" | "md"
) {
  const trackWidth = breakpoint === "sm" ? 550 : breakpoint === "md" ? 950 : 1450;

  const localBrowser = useMemo(() => getLocalBrowser(name, assembly), [name, assembly]);

  // potential infinite loop
  const browserStore = createBrowserStoreMemo(
    {
      domain:
        localBrowser?.domain != null
          ? localBrowser?.domain
          : expandCoordinates(
              {
                chromosome: coordinates.chromosome as Chromosome,
                start: coordinates.start,
                end: coordinates.end,
              },
              type
            ),
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
