import assert from "node:assert/strict";
import { test, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useCcreZScores } from "common/hooks/data/ccre";

vi.mock("common/hooks/data/ccre", () => ({
  useCcreZScores: vi.fn(() => ({ data: {}, loading: false, error: undefined })),
}));
import { createTrackStore, createTrackFromEntry } from "@weng-lab/genomebrowser";
import { validateJson } from "@weng-lab/genomebrowser-ui";
import { createScreenModules } from "../modules/registry";
import { catalogEntries, collectionsByAssembly, defaultTrackIds, isChromHmm } from "../TrackSelect/collections";
import { combineChromHmm, expandChromHmm, CHROMHMM_TRACK_ID } from "../TrackSelect/trackState";
import { isLead, ldConnections, type LDSnp } from "../modules/ldData";
import { parsePeak } from "../modules/tfPeaks";
import type { BulkBedConfig } from "@weng-lab/genomebrowser-tracks/bulkbed";

for (const assembly of ["GRCh38", "mm10"] as const) {
  test(`${assembly}: every catalog entry and default is valid for the beta registry`, () => {
    const store = createTrackStore({ modules: createScreenModules(assembly) });
    for (const collection of collectionsByAssembly[assembly]) validateJson(collection, store.getState().registry);
    const entries = catalogEntries(assembly);
    for (const id of defaultTrackIds(assembly))
      assert.ok(
        entries.some((e) => e.id === id),
        id
      );
    assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
  });
  test(`${assembly}: ChromHMM groups datasets, restores selections, and preserves settings`, () => {
    const useStore = createTrackStore({ modules: createScreenModules(assembly) });
    const registry = useStore.getState().registry;
    const entries = catalogEntries(assembly).filter(isChromHmm).slice(0, 2);
    assert.equal(entries.length, 2);
    const selected = entries.map((e) => createTrackFromEntry(registry, e));
    const combined = combineChromHmm(selected, assembly);
    assert.equal(combined.length, 1);
    assert.equal(combined[0].base.id, CHROMHMM_TRACK_ID);
    assert.equal((combined[0].config as BulkBedConfig).datasets.length, 2);
    assert.deepEqual(
      expandChromHmm(combined, assembly, registry).map((t) => t.base.id),
      selected.map((t) => t.base.id)
    );
    assert.equal(useStore.getState().setTracks(combined).ok, true);
    useStore
      .getState()
      .updateTrack(CHROMHMM_TRACK_ID, { base: { title: "My ChromHMM", color: "#112233" }, config: { rowHeight: 22 } });
    const previous = useStore.getState().tracks[0];
    const deselected = combineChromHmm([selected[1]], assembly, previous);
    assert.equal(deselected[0].base.title, "My ChromHMM");
    assert.equal((deselected[0].config as BulkBedConfig).rowHeight, 22);
    assert.deepEqual(
      (deselected[0].config as BulkBedConfig).datasets.map((d) => d.url),
      [entries[1].config.url]
    );
    assert.deepEqual(combineChromHmm([], assembly, previous), []);
    assert.equal((previous.config as BulkBedConfig).datasets.length, 2, "draft changes must not mutate live tracks");
  });
}

test("LD connects both directions and aligns comma-separated r² scores with their target", () => {
  const snp = (id: string, targets: string, scores: string): LDSnp => ({
    snpid: id,
    ldblocksnpid: targets,
    rsquare: scores,
    chromosome: "chr1",
    start: 10,
    stop: 11,
  });
  const a = snp("lead-a", "Lead", "*"),
    b = snp("lead-b", "Lead", "*"),
    c = snp("linked", "lead-a, lead-b", "0.71, 0.93");
  assert.equal(isLead(a), true);
  assert.equal(isLead(c), false);
  assert.deepEqual(ldConnections([a, b, c], []), []);
  assert.deepEqual(
    ldConnections([a, b, c], ["lead-b"]).map((c) => c.rSquared),
    [0.93]
  );
  assert.deepEqual(
    ldConnections([a, b, c], ["linked"]).map((c) => c.rSquared),
    [0.71, 0.93]
  );
  assert.equal(ldConnections([a, b, c], ["lead-a", "linked"]).length, 2);
  assert.equal(ldConnections([c], ["linked"]).length, 0, "off-region targets should not create arcs");
});

test("TF metadata parser preserves source columns and tolerates absent optional support", () => {
  const fields = [
    "CTCF_1",
    "800",
    ".",
    "1",
    "2",
    "0",
    "1",
    "1",
    "0",
    "CTCF",
    "1/2",
    "EH38E1",
    "ENCSR1",
    '{"K562":{},"A549":{}}',
  ];
  const item = parsePeak({ chromosome: "chr1", start: 1, end: 2, fields });
  assert.equal(item.name, "CTCF_1");
  assert.equal(item.score, 800);
  assert.equal(item.cCREId, "EH38E1");
  assert.deepEqual(item.biosamples, ["A549", "K562"]);
  assert.deepEqual(parsePeak({ ...item, fields: ["CTCF"] }).biosamples, []);
});

test("ChromHMM keeps manually added datasets when all catalog selections are removed", () => {
  const assembly = "GRCh38";
  const store = createTrackStore({ modules: createScreenModules(assembly) });
  const entry = catalogEntries(assembly).find(isChromHmm)!;
  const previous = combineChromHmm([createTrackFromEntry(store.getState().registry, entry)], assembly)[0];
  // Use a real existing source outside the ChromHMM catalog as a manually added dataset.
  const manual = {
    name: "Additional dataset",
    url: String(catalogEntries(assembly).find((e) => e.type === "ccre-bigbed")!.config.url),
  };
  const config = previous.config as BulkBedConfig;
  config.datasets = [...config.datasets, manual];
  const result = combineChromHmm([], assembly, previous);
  assert.equal(result.length, 1);
  assert.deepEqual((result[0].config as BulkBedConfig).datasets, [manual]);
});

test("serialized tracks restore config/order without persisting application callbacks", () => {
  const store = createTrackStore({ modules: createScreenModules("GRCh38") });
  const entries = catalogEntries("GRCh38");
  const ids = ["human-other-tracks::tf-peaks", "human-genes::gencode-v40"];
  const tracks = ids.map((id) =>
    createTrackFromEntry(
      store.getState().registry,
      entries.find((e) => e.id === id)!
    )
  );
  store.getState().setTracks(tracks);
  store
    .getState()
    .updateTrack(ids[0], { config: { filter: ["CTCF"], rowHeight: 18 }, interaction: { onHover: () => {} } });
  const serialized = JSON.stringify(
    store.getState().tracks.map(({ type, base, config, source }) => ({ type, base, config, source }))
  );
  const restored = createTrackStore({ modules: createScreenModules("GRCh38"), tracks: JSON.parse(serialized) });
  assert.deepEqual(restored.getState().order, ids);
  assert.deepEqual((restored.getState().tracks[0].config as { filter: string[] }).filter, ["CTCF"]);
  assert.equal(restored.getState().tracks[0].interaction, undefined);
});

test("cCRE tooltips resolve biosample metadata and use the first-party surface", () => {
  const entry = catalogEntries("GRCh38").find(
    (e) =>
      e.metadata.assay?.toString().toLowerCase() === "ccre" && e.metadata.sourceSampleId !== "aggregate-biosample-data"
  )!;
  const trackModule = createScreenModules("GRCh38").find((m) => m.type === "bigbed")!;
  const html = renderToStaticMarkup(
    createElement(trackModule.tooltipComponent, {
      item: {
        chromosome: "chr1",
        start: 1,
        end: 2,
        fields: [],
        name: "EH38E1",
        ccreClass: "PLS",
        color: "#ff0000",
        score: 0,
        strand: ".",
        thickStart: 1,
        thickEnd: 2,
      },
      context: {
        type: "ccre-bigbed",
        base: { id: entry.id, title: entry.title, display: "dense", height: 20, color: "#000000" },
        config: { url: String(entry.config.url), rowHeight: 12 },
      },
    })
  );
  assert.match(html, /role="tooltip"/);
  assert.match(html, /EH38E1/);
  assert.match(html, /Biosample/);
  assert.equal(vi.mocked(useCcreZScores).mock.lastCall?.[0].biosample, entry.metadata.sourceSampleId);
});
