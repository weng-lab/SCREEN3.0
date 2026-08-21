import Config from "common/config.json";
import { SITE_URL } from "app/sitemap";
import type { Assembly } from "common/types/globalTypes";

/**
 * schema.org `Dataset` markup for the cCRE registries, emitted as JSON-LD by layout.tsx.
 */

/**
 * Matches the license the ENCODE portal declares for the upstream data, so this is neither
 * looser nor tighter than what we received. Version-specific by design -- Google asks for the
 * exact license URL rather than a generic creativecommons.org link, and Dataset Search uses it
 * as a usage-rights filter facet.
 */
const LICENSE = "https://creativecommons.org/licenses/by/4.0/";

/** The catalog every dataset below belongs to. Referenced by @id so it is described once. */
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

/**
 * The labs that build and maintain the registry. The ROR ID identifies the institution rather
 * than the labs, so it hangs off parentOrganization -- Google asks for ROR IDs on institutions
 * specifically, and it is what ties this to UMass Chan in their knowledge graph.
 */
const MOORE_AND_WENG_LABS = {
  "@type": "Organization",
  name: "Moore and Weng Labs at UMass Chan Medical School",
  parentOrganization: {
    "@type": "Organization",
    name: "University of Massachusetts Chan Medical School",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "ROR",
      value: "https://ror.org/0464eyp60",
    },
  },
};

/** Primary registry citation, mirroring the first entry in about/_Sections/HowToCite.tsx. */
const REGISTRY_CITATION = {
  "@type": "ScholarlyArticle",
  name: "An Expanded Registry of Candidate cis-Regulatory Elements",
  identifier: "https://doi.org/10.1038/s41586-025-09909-9",
  url: "https://doi.org/10.1038/s41586-025-09909-9",
};

/**
 * Fields shared by every dataset in the graph. No ATAC-seq: the site surfaces it for some
 * biosamples, but it is not used to generate these classifications.
 */
const REGISTRY_COMMON = {
  "@type": "Dataset",
  creator: MOORE_AND_WENG_LABS,
  // Keeps the consortium credited: ENCODE's data use policy asks for acknowledgement, and CC BY
  // makes attribution a condition rather than a courtesy.
  sourceOrganization: ENCODE_CONSORTIUM,
  citation: REGISTRY_CITATION,
  includedInDataCatalog: { "@id": SCREEN_CATALOG["@id"] },
  isAccessibleForFree: true,
  license: LICENSE,
  url: `${SITE_URL}/downloads`,
  version: "V4",
  // The BED files carry the class, not the Z-scores it was derived from.
  variableMeasured: {
    "@type": "PropertyValue",
    name: "cCRE class",
    description:
      "Cell type-agnostic classification assigned from the element's dominant biochemical signature, " +
      "derived by combining per-assay Z-scores across surveyed biosamples.",
  },
  measurementTechnique: ["DNase-seq", "H3K4me3 ChIP-seq", "H3K27ac ChIP-seq", "CTCF ChIP-seq"],
};

const ASSEMBLIES: Record<Assembly, { label: string; genome: string; registryId: string }> = {
  GRCh38: {
    label: "Human (GRCh38)",
    genome: "human genome (GRCh38/hg38)",
    registryId: `${SITE_URL}/downloads#ccres-grch38`,
  },
  mm10: {
    label: "Mouse (mm10)",
    genome: "mouse genome (GRCm38/mm10)",
    registryId: `${SITE_URL}/downloads#ccres-mm10`,
  },
};

/**
 * Field-level terms that appear in no name or description, so a search for the general area still
 * reaches these datasets. Terms already in the prose are left out deliberately: name and
 * description are the fields Google names as driving findability, so repeating them adds nothing.
 */
const GENERIC_KEYWORDS = ["regulatory genomics", "genome annotation", "epigenomics", "gene regulation"];

/** BED files are tab-separated; Google matches on the MIME type rather than the "BED" name. */
const BED = "text/tab-separated-values";

type ClassFile = {
  contentUrl: string;
  /** Duplicated from AnnotationsByClass.tsx. Kept in sync by hand -- see the note at the top. */
  contentSize: string;
  /** Element count, as displayed on the download button. */
  count: string;
};

type CcreClassSpec = {
  /** Fragment slug; combined with the assembly to form each subdataset's @id. */
  slug: string;
  /**
   * Middle of the name template, and the noun phrase used in the description. Reads in both
   * "Human (GRCh38) <phrase> -- ENCODE Registry V4" and "contains the 47,532 <phrase>".
   */
  phrase: string;
  /**
   * Class definition, taken verbatim from CCRE_CLASSES in about/_Sections/CcreClassification.tsx
   * so the site and the markup describe each class the same way. Where that list treats a group
   * as one entry (enhancer-like) the split below is derived from its own subdivision wording.
   */
  definition: string;
  keywords: string[];
  files: Record<Assembly, ClassFile>;
};

const CCRE_CLASSES: CcreClassSpec[] = [
  {
    slug: "pls",
    phrase: "promoter-like cCREs (PLS)",
    definition:
      "Elements located near annotated or experimentally derived TSSs with high chromatin accessibility and H3K4me3 signal.",
    keywords: ["transcription start site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanPromoters, contentSize: "2.6 MB", count: "47,532" },
      mm10: { contentUrl: Config.Downloads.MousePromoters, contentSize: "1.5 MB", count: "27,332" },
    },
  },
  {
    slug: "els",
    phrase: "candidate enhancers (pELS and dELS combined)",
    definition:
      "Accessible elements with high H3K27ac signal, subdivided into TSS-proximal and TSS-distal enhancers based on distance to the nearest TSS.",
    keywords: ["ELS", "chromatin accessibility"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanEnhancers, contentSize: "94.4 MB", count: "1,718,669" },
      mm10: { contentUrl: Config.Downloads.MouseEnhancers, contentSize: "28.2 MB", count: "512,001" },
    },
  },
  {
    slug: "pels",
    phrase: "proximal enhancer-like cCREs (pELS)",
    definition:
      "Accessible elements with high H3K27ac signal, classified as TSS-proximal by distance to the nearest annotated TSS.",
    keywords: ["chromatin accessibility", "transcription start site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanProximalEnhancers, contentSize: "13.7 MB", count: "249,464" },
      mm10: { contentUrl: Config.Downloads.MouseProximalEnhancers, contentSize: "6.1 MB", count: "111,218" },
    },
  },
  {
    slug: "dels",
    phrase: "distal enhancer-like cCREs (dELS)",
    definition:
      "Accessible elements with high H3K27ac signal, classified as TSS-distal by distance to the nearest annotated TSS.",
    keywords: ["chromatin accessibility", "transcription start site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanDistalEnhancers, contentSize: "80.7 MB", count: "1,469,205" },
      mm10: { contentUrl: Config.Downloads.MouseDistalEnhancers, contentSize: "22.0 MB", count: "400,783" },
    },
  },
  {
    slug: "ca-ctcf",
    phrase: "chromatin accessible cCREs with CTCF (CA-CTCF)",
    definition: "Accessible elements with strong CTCF binding and low histone acetylation.",
    keywords: ["chromatin accessibility", "CTCF binding site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanCA_CTCF, contentSize: "7.3 MB", count: "126,034" },
      mm10: { contentUrl: Config.Downloads.MouseCA_CTCF, contentSize: "2.7 MB", count: "45,933" },
    },
  },
  {
    slug: "ca-h3k4me3",
    phrase: "chromatin accessible cCREs with H3K4me3 (CA-H3K4me3)",
    definition: "Accessible elements with H3K4me3 but lacking strong H3K27ac and located away from TSSs.",
    keywords: ["chromatin accessibility", "transcription start site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanCA_H3K4me3, contentSize: "4.8 MB", count: "79,246" },
      mm10: { contentUrl: Config.Downloads.MouseCA_H3K4me3, contentSize: "1.5 MB", count: "23,832" },
    },
  },
  {
    slug: "ca-tf",
    phrase: "chromatin accessible cCREs with transcription factor binding (CA-TF)",
    definition:
      "Accessible elements overlapping transcription factor clusters but lacking strong histone modification signals.",
    keywords: ["chromatin accessibility", "TF binding site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanCA_TF, contentSize: "1.5 MB", count: "26,102" },
      mm10: { contentUrl: Config.Downloads.MouseCA_TF, contentSize: "0.6 MB", count: "10,707" },
    },
  },
  {
    slug: "ca",
    phrase: "chromatin accessible only cCREs (CA)",
    definition: "Accessible elements lacking strong H3K4me3, H3K27ac, or CTCF signals.",
    keywords: ["chromatin accessibility", "DNase hypersensitivity"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanCA_only, contentSize: "13.0 MB", count: "245,985" },
      mm10: { contentUrl: Config.Downloads.MouseCA_only, contentSize: "15.4 MB", count: "291,800" },
    },
  },
  {
    slug: "tf",
    phrase: "transcription factor only cCREs (TF)",
    definition:
      "Elements defined by transcription factor binding in the absence of detectable chromatin accessibility or histone modification signals.",
    keywords: ["TF binding site"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanTF_only, contentSize: "5.6 MB", count: "105,286" },
      mm10: { contentUrl: Config.Downloads.MouseTF_only, contentSize: "0.8 MB", count: "15,283" },
    },
  },
  {
    slug: "ctcf-bound",
    // TODO(descriptions): CcreClassification.tsx has no entry for this set, so the wording below
    // is a minimal restatement rather than a real definition. Needs a pass from someone who can
    // state the criterion. Note this set is orthogonal to the classes above, not disjoint from
    // them -- it spans several of them.
    phrase: "CTCF-bound cCREs",
    definition: "cCREs carrying CTCF binding support, spanning several of the cell type-agnostic classes.",
    keywords: ["CTCF binding site", "chromatin accessibility"],
    files: {
      GRCh38: { contentUrl: Config.Downloads.HumanCA_Bound, contentSize: "63.0 MB", count: "948,642" },
      mm10: { contentUrl: Config.Downloads.MouseCA_Bound, contentSize: "9.4 MB", count: "139,894" },
    },
  },
];

const classId = (spec: CcreClassSpec, assembly: Assembly) =>
  `${SITE_URL}/downloads#${spec.slug}-${assembly.toLowerCase()}`;

/** One subdataset per class per assembly, linked back to its registry with isPartOf. */
function classSubdataset(spec: CcreClassSpec, assembly: Assembly) {
  const { label, genome, registryId } = ASSEMBLIES[assembly];
  const file = spec.files[assembly];

  return {
    ...REGISTRY_COMMON,
    "@id": classId(spec, assembly),
    name: `${label} ${spec.phrase} — ENCODE Registry V4`,
    description:
      `${spec.definition} This file contains the ${file.count} ${spec.phrase} in the ENCODE Registry of ` +
      `candidate cis-regulatory elements (V4) for the ${genome}, as a BED file of genomic coordinates, ` +
      `accessions and cCRE classes.`,
    keywords: [...spec.keywords, ...GENERIC_KEYWORDS],
    isPartOf: { "@id": registryId },
    distribution: [
      {
        "@type": "DataDownload",
        name: `${label} ${spec.phrase}`,
        contentUrl: file.contentUrl,
        encodingFormat: BED,
        contentSize: file.contentSize,
      },
    ],
  };
}

/**
 * The registry-wide description, shared by both assemblies. Element and biosample counts come
 * from the assembly headers in _Annotations/Header.tsx.
 */
const registryDescription = (genome: string, elements: string, biosamples: string) =>
  `The ENCODE Registry of candidate cis-regulatory elements (cCREs) for the ${genome}. ${elements} elements ` +
  `annotated across ${biosamples} cell and tissue types, each assigned a cell type-agnostic class from its ` +
  `dominant biochemical signature: promoter-like (PLS), proximal and distal enhancer-like (pELS, dELS), ` +
  `CTCF-bound, chromatin accessible, and transcription factor bound. Classes are called from combined ` +
  `per-assay Z-scores computed over DNase-seq and H3K4me3, H3K27ac and CTCF ChIP-seq signal. Distributed ` +
  `as BED files giving the genomic coordinates, accession and class of every element.`;

/** hasPart mirrors the isPartOf on each subdataset, so the link reads in both directions. */
const registryParts = (assembly: Assembly) => CCRE_CLASSES.map((spec) => ({ "@id": classId(spec, assembly) }));

const HUMAN_REGISTRY = {
  ...REGISTRY_COMMON,
  "@id": ASSEMBLIES.GRCh38.registryId,
  name: "ENCODE Registry of candidate cis-Regulatory Elements (cCREs), human GRCh38",
  description: registryDescription(ASSEMBLIES.GRCh38.genome, "2,348,854", "1,888"),
  keywords: ["chromatin accessibility", ...GENERIC_KEYWORDS],
  hasPart: registryParts("GRCh38"),
  distribution: [
    {
      "@type": "DataDownload",
      name: "All human cCREs (GRCh38)",
      contentUrl: Config.Downloads.HumanCCREs,
      encodingFormat: BED,
      contentSize: "129.1 MB",
    },
    {
      "@type": "DataDownload",
      name: "Human cCREs with multi-mappers (GRCh38)",
      contentUrl: Config.Downloads.HumanCCREsMultimappers,
      encodingFormat: BED,
      contentSize: "130.6 MB",
    },
  ],
};

const MOUSE_REGISTRY = {
  ...REGISTRY_COMMON,
  "@id": ASSEMBLIES.mm10.registryId,
  name: "ENCODE Registry of candidate cis-Regulatory Elements (cCREs), mouse mm10",
  description: registryDescription(ASSEMBLIES.mm10.genome, "926,843", "366"),
  keywords: ["chromatin accessibility", ...GENERIC_KEYWORDS],
  hasPart: registryParts("mm10"),
  distribution: [
    {
      "@type": "DataDownload",
      name: "All mouse cCREs (mm10)",
      contentUrl: Config.Downloads.MouseCCREs,
      encodingFormat: BED,
      contentSize: "50.6 MB",
    },
    {
      "@type": "DataDownload",
      name: "Mouse cCREs with multi-mappers (mm10)",
      contentUrl: Config.Downloads.MouseCCREsMultimappers,
      encodingFormat: BED,
      contentSize: "53.2 MB",
    },
  ],
};

export const GOOGLE_DATASETS = {
  "@context": "https://schema.org",
  "@graph": [
    SCREEN_CATALOG,
    HUMAN_REGISTRY,
    MOUSE_REGISTRY,
    ...CCRE_CLASSES.map((spec) => classSubdataset(spec, "GRCh38")),
    ...CCRE_CLASSES.map((spec) => classSubdataset(spec, "mm10")),
  ],
};
