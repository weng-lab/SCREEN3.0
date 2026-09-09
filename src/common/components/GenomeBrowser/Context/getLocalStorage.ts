"use client";
import {
  normalizeRegion,
  type AnyTrackInstance,
  type GenomicRegion,
  type Highlight,
  type ModuleRegistry,
} from "@weng-lab/genomebrowser";
import { z } from "zod";
import { assemblies } from "common/assemblies";
import type { Assembly } from "common/types/globalTypes";

// Keep the existing namespace so current sessions continue to restore.
const VERSION = "v2";
type BrowserState = { region: GenomicRegion; highlights: Highlight[] };
const regionSchema = z.object({ chromosome: z.string().min(1), start: z.number().int(), end: z.number().int() });
const browserSchema = z.object({
  region: regionSchema,
  highlights: z.array(
    z.object({
      id: z.string().min(1),
      region: regionSchema.extend({ chromosome: z.string().min(1).optional() }).refine((r) => r.start < r.end),
      color: z.string().min(1),
      opacity: z.number().min(0).max(1).optional(),
    })
  ),
});
const tracksSchema = z.array(
  z.object({
    type: z.string().min(1),
    base: z.record(z.string(), z.unknown()),
    config: z.record(z.string(), z.unknown()),
    source: z.enum(["host", "user"]),
  })
);

function read(key: string): unknown {
  try {
    return typeof window === "undefined" ? null : JSON.parse(window.sessionStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    const serialized = JSON.stringify(value);
    if (window.sessionStorage.getItem(key) !== serialized) window.sessionStorage.setItem(key, serialized);
  } catch {
    /* Browsing still works with disabled or full session storage. */
  }
}
export function getLocalBrowser(name: string, assembly: Assembly): BrowserState | null {
  const parsed = browserSchema.safeParse(read(`${assembly}-${name}-browser-${VERSION}`));
  if (!parsed.success) return null;
  const region = normalizeRegion(parsed.data.region, assemblies[assembly].browserAssembly);
  if (!region.ok) return null;
  // The schema projects only owned fields; saved assembly/dimensions can never override the session.
  return { region: region.region, highlights: durableHighlights(parsed.data.highlights) };
}
export const durableHighlights = (highlights: Highlight[]) => highlights.filter((h) => h.id !== "hover-highlight");

/** Hover and layout updates must not even serialize the saved browser state. */
export function sameBrowserState(a: BrowserState, b: BrowserState) {
  const sameRegion = (x: Highlight["region"], y: Highlight["region"]) =>
    x.chromosome === y.chromosome && x.start === y.start && x.end === y.end;
  return (
    sameRegion(a.region, b.region) &&
    a.highlights.length === b.highlights.length &&
    a.highlights.every((h, i) => {
      const other = b.highlights[i];
      return (
        h.id === other.id &&
        h.color === other.color &&
        h.opacity === other.opacity &&
        sameRegion(h.region, other.region)
      );
    })
  );
}
export function setLocalBrowser(name: string, assembly: Assembly, state: BrowserState) {
  write(`${assembly}-${name}-browser-${VERSION}`, {
    region: state.region,
    highlights: durableHighlights(state.highlights),
  });
}
export function getLocalTracks(assembly: Assembly, registry: ModuleRegistry): AnyTrackInstance[] | null {
  const parsed = tracksSchema.safeParse(read(`${assembly}-tracks-${VERSION}`));
  if (!parsed.success) return null;
  try {
    return parsed.data.map((track) => registry.get(track.type).validate(track));
  } catch {
    return null;
  }
}
export function setLocalTracks(tracks: AnyTrackInstance[], assembly: Assembly) {
  write(
    `${assembly}-tracks-${VERSION}`,
    tracks.map(({ type, base, config, source }) => ({ type, base, config, source }))
  );
}
