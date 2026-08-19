import Config from "common/config.json";
import { SITE_URL } from "app/sitemap";

/**
 * schema.org `Dataset` markup for the cCRE registries, emitted as JSON-LD by layout.tsx.
 *
 * This is what registers SCREEN with Google Dataset Search: there is no submission form, the
 * crawler reads this markup off the page. It only works on a page robots.ts allows -- /downloads
 * is on the allowlist, most of the site is not -- and it must be in the server-rendered HTML,
 * since markup injected after hydration is only picked up on Google's slower second pass.
 *
 * Two entries as a starting point, one per assembly. The remaining download categories
 * (data matrices, gene links, functional characterization) are modeled the same way.
 *
 * Deliberately missing, because neither can be invented and both need a real value:
 *   - `identifier`: a DOI for the registry itself. This is what lets Dataset Search recognize
 *     our entry and the same data on the ENCODE portal as one dataset rather than two.
 *   - `license`: the URL of the ENCODE data use policy. It is a filter facet in Dataset Search,
 *     so entries without it are excluded when users filter by usage rights.
 */

/** The catalog both datasets belong to. Referenced by @id so it is described once. */
const SCREEN_CATALOG = {
  "@type": "DataCatalog",
  "@id": `${SITE_URL}/#catalog`,
  name: "SCREEN",
  alternateName: "Search Candidate cis-Regulatory Elements by ENCODE",
  url: SITE_URL,
};

const ENCODE_CONSORTIUM = {
  "@type": "Organization",
  name: "ENCODE Project Consortium",
  url: "https://www.encodeproject.org",
};

/** Primary registry citation, mirroring the first entry in about/_Sections/HowToCite.tsx. */
const REGISTRY_CITATION = {
  "@type": "ScholarlyArticle",
  name: "An Expanded Registry of Candidate cis-Regulatory Elements",
  identifier: "https://doi.org/10.1038/s41586-025-09909-9",
  url: "https://doi.org/10.1038/s41586-025-09909-9",
};

/**
 * Shared across both assemblies. `variableMeasured` and `measurementTechnique` are what let
 * Dataset Search match assay-level queries ("DNase-seq enhancer annotations") rather than only
 * matching on the dataset title.
 */
const COMMON = {
  "@type": "Dataset",
  creator: ENCODE_CONSORTIUM,
  citation: REGISTRY_CITATION,
  includedInDataCatalog: { "@id": SCREEN_CATALOG["@id"] },
  isAccessibleForFree: true,
  version: "V4",
  measurementTechnique: ["DNase-seq", "ATAC-seq", "ChIP-seq"],
  variableMeasured: [
    "DNase-seq signal (Z-score)",
    "H3K4me3 ChIP-seq signal (Z-score)",
    "H3K27ac ChIP-seq signal (Z-score)",
    "CTCF ChIP-seq signal (Z-score)",
  ],
  url: `${SITE_URL}/downloads`,
};

export const DOWNLOADS_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    SCREEN_CATALOG,
    {
      ...COMMON,
      "@id": `${SITE_URL}/downloads#ccres-grch38`,
      name: "ENCODE Registry of candidate cis-Regulatory Elements (cCREs), human GRCh38",
      description:
        "The ENCODE Registry of candidate cis-regulatory elements (cCREs) for the human genome, " +
        "GRCh38/hg38. 2,348,854 elements annotated across 1,888 cell and tissue types, each assigned " +
        "a cell type-agnostic class from its dominant biochemical signature: promoter-like (PLS), " +
        "proximal and distal enhancer-like (pELS, dELS), CTCF-bound, chromatin accessible, and " +
        "transcription factor bound. Derived from integrated DNase-seq, ATAC-seq, and H3K4me3, " +
        "H3K27ac and CTCF ChIP-seq experiments. Distributed as BED files giving the genomic " +
        "coordinates, accession and class of every element.",
      keywords: [
        "cis-regulatory elements",
        "cCRE",
        "enhancer",
        "promoter",
        "human",
        "GRCh38",
        "hg38",
        "ENCODE",
        "regulatory genomics",
        "chromatin accessibility",
      ],
      distribution: [
        {
          "@type": "DataDownload",
          name: "All human cCREs (GRCh38)",
          contentUrl: Config.Downloads.HumanCCREs,
          encodingFormat: "text/tab-separated-values",
          contentSize: "129.1 MB",
        },
        {
          "@type": "DataDownload",
          name: "Human cCREs with multi-mappers (GRCh38)",
          contentUrl: Config.Downloads.HumanCCREsMultimappers,
          encodingFormat: "text/tab-separated-values",
          contentSize: "130.6 MB",
        },
      ],
    },
    {
      ...COMMON,
      "@id": `${SITE_URL}/downloads#ccres-mm10`,
      name: "ENCODE Registry of candidate cis-Regulatory Elements (cCREs), mouse mm10",
      description:
        "The ENCODE Registry of candidate cis-regulatory elements (cCREs) for the mouse genome, " +
        "GRCm38/mm10. 926,843 elements annotated across 366 cell and tissue types, each assigned " +
        "a cell type-agnostic class from its dominant biochemical signature: promoter-like (PLS), " +
        "proximal and distal enhancer-like (pELS, dELS), CTCF-bound, chromatin accessible, and " +
        "transcription factor bound. Derived from integrated DNase-seq, ATAC-seq, and H3K4me3, " +
        "H3K27ac and CTCF ChIP-seq experiments. Distributed as BED files giving the genomic " +
        "coordinates, accession and class of every element.",
      keywords: [
        "cis-regulatory elements",
        "cCRE",
        "enhancer",
        "promoter",
        "mouse",
        "mm10",
        "GRCm38",
        "ENCODE",
        "regulatory genomics",
        "chromatin accessibility",
      ],
      distribution: [
        {
          "@type": "DataDownload",
          name: "All mouse cCREs (mm10)",
          contentUrl: Config.Downloads.MouseCCREs,
          encodingFormat: "text/tab-separated-values",
          contentSize: "50.6 MB",
        },
        {
          "@type": "DataDownload",
          name: "Mouse cCREs with multi-mappers (mm10)",
          contentUrl: Config.Downloads.MouseCCREsMultimappers,
          encodingFormat: "text/tab-separated-values",
          contentSize: "53.2 MB",
        },
      ],
    },
  ],
};
