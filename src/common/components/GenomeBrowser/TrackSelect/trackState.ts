import { createTrackFromEntry, type AnyTrackInstance, type ModuleRegistry } from "@weng-lab/genomebrowser";
import { bulkBedModule, type BulkBedConfig } from "@weng-lab/genomebrowser-tracks/bulkbed";
import type { Assembly } from "common/types/globalTypes";
import { catalogEntries, isChromHmm } from "./collections";

export const CHROMHMM_TRACK_ID = "screen-chromhmm";

/** Many catalog selections become datasets of one browser track. */
export function combineChromHmm(
  tracks: AnyTrackInstance[],
  assembly: Assembly,
  previous?: AnyTrackInstance
): AnyTrackInstance[] {
  const entries = new Map(catalogEntries(assembly).flatMap((e) => (isChromHmm(e) ? [[e.id, e] as const] : [])));
  const selected = tracks.filter((t) => entries.has(t.base.id));
  const seen = new Set<string>();
  const datasets = selected.flatMap((t) => {
    const url = String((t.config as { url: string }).url);
    if (seen.has(url)) return [];
    seen.add(url);
    return [{ name: String(entries.get(t.base.id).metadata.displayName), url }];
  });
  const oldConfig = previous?.config as BulkBedConfig | undefined;
  // Preserve manually added sources as well as their order and edited display names.
  const catalogUrls = new Set([...entries.values()].map((e) => String(e.config.url)));
  const oldDatasets = oldConfig?.datasets ?? [];
  const retained = oldDatasets.filter((d) => !catalogUrls.has(d.url) || seen.has(d.url));
  const retainedUrls = new Set(retained.map((d) => d.url));
  const nextDatasets = [...retained, ...datasets.filter((d) => !retainedUrls.has(d.url))];
  if (!nextDatasets.length) return tracks.filter((t) => t.base.id !== CHROMHMM_TRACK_ID);
  const combined = bulkBedModule.create({
    ...previous?.base,
    display: "full",
    id: CHROMHMM_TRACK_ID,
    title: previous?.base.title ?? "ChromHMM",
    source: "host",
    config: { ...oldConfig, datasets: nextDatasets },
  });
  const firstIndex = tracks.findIndex((t) => entries.has(t.base.id));
  if (firstIndex < 0) return [...tracks.filter((t) => t.base.id !== CHROMHMM_TRACK_ID), combined];
  return tracks.flatMap((t, i) =>
    i === firstIndex ? [combined] : entries.has(t.base.id) || t.base.id === CHROMHMM_TRACK_ID ? [] : [t]
  );
}

/** A private selection store exposes individual datasets without changing the live browser. */
export function expandChromHmm(tracks: AnyTrackInstance[], assembly: Assembly, registry: ModuleRegistry) {
  const entries = catalogEntries(assembly).filter(isChromHmm);
  return tracks.flatMap((track) => {
    if (track.base.id !== CHROMHMM_TRACK_ID) return [track];
    const urls = new Set((track.config as BulkBedConfig).datasets.map((d) => d.url));
    return entries.flatMap((entry) =>
      urls.has(String(entry.config.url)) ? [createTrackFromEntry(registry, entry)] : []
    );
  });
}
