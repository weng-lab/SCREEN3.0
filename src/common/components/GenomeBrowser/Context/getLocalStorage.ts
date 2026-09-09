"use client";
import type { AnyTrackInstance, GenomicRegion, Highlight } from "@weng-lab/genomebrowser";

// Application-owned schema version; package.json is intentionally not a public package export.
const VERSION = "v2";
type BrowserState = { region: GenomicRegion; highlights: Highlight[] };
function read(key: string): unknown {
  try {
    return typeof window === "undefined" ? null : JSON.parse(window.sessionStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Browsing still works with disabled or full session storage. */
  }
}
export function getLocalBrowser(name: string, assembly: string): BrowserState | null {
  return read(`${assembly}-${name}-browser-${VERSION}`) as BrowserState | null;
}
export function setLocalBrowser(name: string, assembly: string, state: BrowserState) {
  write(`${assembly}-${name}-browser-${VERSION}`, {
    ...state,
    highlights: state.highlights.filter((h) => h.id !== "hover-highlight"),
  });
}
export function getLocalTracks(assembly: string): AnyTrackInstance[] | null {
  return read(`${assembly}-tracks-${VERSION}`) as AnyTrackInstance[] | null;
}
export function setLocalTracks(tracks: AnyTrackInstance[], assembly: string) {
  write(
    `${assembly}-tracks-${VERSION}`,
    tracks.map(({ type, base, config, source }) => ({ type, base, config, source }))
  );
}
