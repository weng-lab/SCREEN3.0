"use client";

import { Domain, Highlight, Track } from "@weng-lab/genomebrowser";
import { isValidAssembly } from "common/types/globalTypes";

// Simplified browser state
type LocalBrowserState = {
  domain: Domain;
  highlights: Highlight[];
};

/**
 * Gets the browser state from session storage for the associated assembly and element
 * @param name the name of the element
 * @param assembly the assembly
 * @returns a simplified browser state object
 */
export function getLocalBrowser(name: string, assembly: string): LocalBrowserState | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  if (!isValidAssembly(assembly)) return null;

  const localBrowserState = sessionStorage.getItem(assembly + "-" + name + "-browser-state");
  if (!localBrowserState) return null;
  const localBrowserStateJson = JSON.parse(localBrowserState) as LocalBrowserState;
  return localBrowserStateJson;
}

export function setLocalBrowser(name: string, assembly: string, localBrowserState: LocalBrowserState) {
  sessionStorage.setItem(assembly + "-" + name + "-browser-state", JSON.stringify(localBrowserState));
}

export function getLocalTracks(assembly: string): Track[] | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  if (!isValidAssembly(assembly)) return null;

  const localTracks = sessionStorage.getItem(assembly + "-" + "tracks");
  if (!localTracks) return null;
  const localTracksJson = JSON.parse(localTracks) as Track[];
  return localTracksJson;
}

export function setLocalTracks(tracks: Track[], assembly: string) {
  sessionStorage.setItem(assembly + "-tracks", JSON.stringify(tracks));
}
