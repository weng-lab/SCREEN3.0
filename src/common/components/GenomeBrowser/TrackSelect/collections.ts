import type { TrackSelectCollection } from "@weng-lab/genomebrowser-ui";
import type { Assembly } from "common/types/globalTypes";
import human from "./data/human-biosamples.json";
import mouse from "./data/mouse-biosamples.json";
import { PEAKS_URL, MOTIFS_URL } from "../modules/tfSources";

export const HUMAN_GENE_URL =
  "https://users.wenglab.org/niship/gencodefiles/human.gencode.v40.comprehensive.annotation.bb";
const simpleView = [
  { id: "default", label: "Tracks", columns: [{ field: "title", label: "Track" }], grouping: [], leaf: "title" },
];
const genes: TrackSelectCollection = {
  id: "human-genes",
  label: "Genes",
  views: simpleView,
  tracks: [
    {
      type: "gene",
      id: "gencode-v40",
      title: "GENCODE v40 Genes",
      display: "merged",
      color: "#0c184a",
      config: { url: HUMAN_GENE_URL },
      metadata: {},
    },
  ],
};
const other: TrackSelectCollection = {
  id: "human-other-tracks",
  label: "Other Tracks",
  views: simpleView,
  tracks: [
    {
      type: "screen-tf-peaks",
      id: "tf-peaks",
      title: "TF ChIP-seq Peaks",
      config: { primaryUrl: PEAKS_URL, overlayUrl: MOTIFS_URL },
      metadata: {},
    },
  ],
};
export const collectionsByAssembly: Record<Assembly, TrackSelectCollection[]> = {
  GRCh38: [genes, human, other],
  mm10: [mouse],
};
export function defaultTrackIds(assembly: Assembly) {
  const prefix = assembly === "GRCh38" ? "human" : "mouse";
  return [
    ...(assembly === "GRCh38" ? ["human-genes::gencode-v40"] : []),
    ...["ccre", "dnase", "h3k4me3", "h3k27ac", "ctcf", "atac"].map(
      (assay) => `${prefix}-biosamples::${assay}-aggregate`
    ),
  ];
}
function buildCatalogEntries(collections: TrackSelectCollection[]) {
  return collections.flatMap((collection) =>
    collection.tracks.map((track) => ({ ...track, id: `${collection.id}::${track.id}` }))
  );
}
const entriesByAssembly = {
  GRCh38: buildCatalogEntries(collectionsByAssembly.GRCh38),
  mm10: buildCatalogEntries(collectionsByAssembly.mm10),
};
export function catalogEntries(assembly: Assembly) {
  return entriesByAssembly[assembly];
}
export function isChromHmm(entry: { metadata: Record<string, unknown> }) {
  return String(entry.metadata.assay).toLowerCase() === "chromhmm";
}

const ccreUrls = new Set(
  [human, mouse].flatMap((collection) =>
    collection.tracks.flatMap((track) =>
      track.metadata.assay.toLowerCase() === "ccre" ? [String(track.config.url)] : []
    )
  )
);
export function isCcreUrl(url: unknown) {
  return typeof url === "string" && ccreUrls.has(url);
}
