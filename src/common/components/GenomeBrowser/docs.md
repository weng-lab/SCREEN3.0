# Genome browser v2

SCREEN uses the published `2.0.0-beta.1` runtime, tracks, UI, and genomic reader packages.

## State and navigation

`GenomeBrowserView` owns stable per-entity browser and track stores. Coordinates are padded exactly
once there. GWAS block changes explicitly move the viewport; normal rerenders do not reset pan/zoom.
`ResizeObserver` sizes the browser to its container. Browser navigation uses `region` / `setRegion`.

Session storage uses SCREEN's `v2` schema namespace. Old v1 track selections and highlights are left
untouched but are not loaded into v2. The v2 state restores track order, settings, datasets, viewport,
and user highlights; callbacks are reconstructed from application code, and transient hover
highlights are excluded. Invalid or inaccessible storage falls back to defaults.

## Tracks and collections

- `TrackSelect/data/human-biosamples.json` comes from genomebrowser's standalone app (beta.1).
- `mouse-biosamples.json` translates the old UI 0.4.2 mouse catalog, retaining source URLs and metadata.
- Human genes use the file-backed GENCODE v40 **comprehensive** Gene module, in `merged` display.
  This replaces the previous GraphQL/basic annotation track. The mm10 Gene track is intentionally
  absent pending an annotation URL; add it in `TrackSelect/collections.ts` when available.
- Human cytobands are bundled from the monorepo's `hg38.cytoBand.txt`. Mouse cytobands retain the
  existing SCREEN GraphQL query until a static dataset is available.

The selector edits a private store. Submit combines ChromHMM selections into the single
`screen-chromhmm` BulkBed track; Cancel does not touch the live store. Dataset URLs are deduplicated,
deselection removes that dataset, and removing the last selected dataset removes the track unless
it contains additional manually configured sources. Existing names, ordering, row height, gap,
color, and title survive selection edits. Reopening expands datasets back into catalog selections.

`modules/registry.tsx` retains first-party fetchers, renderers, and settings while supplying SCREEN
cCRE and ChromHMM tooltips. cCRE source URLs resolve biosample metadata; feature clicks navigate to
SCREEN. Gene callbacks read `item.feature`, including when hovering an exon or intron.

## SCREEN-owned modules

- `screen-ld`: follows Psychscreen's v2 module/interaction pattern while retaining SCREEN's LD-block
  rendering and existing study data. `LDDataContext` supplies the Apollo result without an extra
  fetch or an external core data store. Relationships and r² values come from the study response,
  including comma-separated target/score pairs. Hover reveals arcs; clicks toggle pinned SNPs.
- `screen-tf-peaks`: ports the old TF peak and motif overlay track to `genomic-reader`. File readers
  are cached per browser track. TF filtering, score shading, motif overlays/logos, cCRE accessions,
  and supporting biosamples are retained.

All module tooltips use the tracks package's `TrackTooltip`; settings use its shared field and
layout components. `createSettingsStore({ baseSettingsComponent: TrackBaseSettings })` supplies the
same title, color, height, row-height, and display controls used by the monorepo app.

## Verification

Run `yarn test:browser`, `yarn exec tsc --noEmit --incremental false`, and `yarn build`.
Live checks should cover human and mouse regions, cCRE and gene navigation, TF filtering/settings,
ChromHMM add/remove/cancel/reset, session reload, viewport sizing, and switching GWAS LD blocks.
API-backed tooltip scores, search, and GWAS data require a working SCREEN API even though gene and
signal tracks read files directly.
