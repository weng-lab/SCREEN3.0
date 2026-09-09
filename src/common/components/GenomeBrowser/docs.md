# Genome browser v2

SCREEN uses the published `2.0.0-beta.1` runtime, tracks, UI, and genomic reader packages.

## State and navigation

`GenomeBrowserView` keys the complete browser session by assembly, entity type, and entity ID.
`Context/useBrowserSession.tsx` composes its stores and pads coordinates once;
`useEntityInteractions.ts` owns SCREEN routing and hover callbacks. GWAS block changes explicitly
move the viewport; normal rerenders do not reset pan/zoom. Switching entities also closes old
settings and selection dialogs. Callback updates rebind interactions without recreating tracks.
`ResizeObserver` sizes the browser to its container. SCREEN's button layout uses the shared
`BrowserNavigationButton`, including width-preserving pans at chromosome boundaries.

Session storage keeps SCREEN's existing `v2` namespace. Regions and permanent highlights belong
to each entity; non-GWAS track preferences are shared across entities of the same assembly. GWAS
retains its dedicated tracks without track persistence, and explicitly recenters on its active LD
block. Old v1 records remain untouched and are not loaded into v2.

Restoration validates the browser fields against an application schema and the region against its
assembly. Only region/highlights can override initial browser state. Saved track fields are checked
against registered modules; invalid state falls back to defaults, and an intentionally empty track
list remains empty. Callbacks are reconstructed from application code.

Only durable changes are written: region, permanent highlights, and track type/base/config/source
in display order. Hover-only browser changes do not serialize state. Layout and callback-only
updates do not write it, and identical serialized values are not written again. Saving remains
synchronous, with no timer or delayed flush. Disabled/full session storage does not prevent browsing.

## Tracks and collections

- `TrackSelect/data/human-biosamples.json` comes from genomebrowser's standalone app (beta.1).
- `mouse-biosamples.json` translates the old UI 0.4.2 mouse catalog, retaining source URLs and metadata.
- Human genes use the file-backed GENCODE v40 **comprehensive** Gene module, in `merged` display.
  This replaces the previous GraphQL/basic annotation track. The mm10 Gene track is intentionally
  absent pending an annotation URL; add it in `TrackSelect/collections.ts` when available.
- `common/assemblies.ts` maps SCREEN assembly IDs (`GRCh38` and `mm10`) to browser assembly
  objects, UCSC database/track names, and supporting file URLs. Chromosome lengths come from the
  browser assembly objects; UCSC `chromInfo.txt.gz` references are provided for verification.
- Both assemblies load bundled UCSC five-column cytoband tables from `public/genome-browser/`.
  Human bands retain the monorepo's `hg38.cytoBand.txt`; mouse bands are the decompressed UCSC
  mm10 `cytoBand.txt.gz`, including band names. No GraphQL cytoband query is needed.
  Source URLs are recorded in `common/assemblies.ts`.

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
  and supporting biosamples are retained. Its renderer and tooltip load on demand, so motif JSON
  and logo rendering are deferred until TF rendering/tooltip use. Source URL constants live in
  `tfSources.ts` without importing renderer code. Both biosample catalogs remain bundled; splitting
  catalog initialization and tooltip metadata is outside this small loading cleanup.

All module tooltips use the tracks package's `TrackTooltip`; settings use its shared field and
layout components. `createSettingsStore({ baseSettingsComponent: TrackBaseSettings })` supplies the
same title, color, height, row-height, and display controls used by the monorepo app.

## Verification

Run `yarn exec tsc --noEmit --incremental false` and targeted ESLint on changed files.
No dedicated regression suite is maintained for this integration.
Live checks should cover human and mouse regions, cCRE and gene navigation, TF filtering/settings,
ChromHMM add/remove/cancel/reset, session reload, viewport sizing, and switching GWAS LD blocks.
API-backed tooltip scores, search, and GWAS data require a working SCREEN API even though gene and
signal tracks read files directly.
