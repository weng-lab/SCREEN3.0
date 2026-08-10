import { CheckboxOption } from "app/downloads/_DownloadRange/CheckboxGroup";
import { Assays, Conservation } from "app/downloads/_DownloadRange/downloadRangeHelpers";

export const DEFAULT_REGION = "chr12:53,380,176-53,416,446";

export const ALL_ASSAYS: Assays = { atac: true, ctcf: true, dnase: true, h3k27ac: true, h3k4me3: true };

export const ALL_CONSERVATION: Conservation = { primate: true, mammal: true, vertebrate: true };
export const NO_CONSERVATION: Conservation = { primate: false, mammal: false, vertebrate: false };

export const ASSAY_OPTIONS: CheckboxOption<keyof Assays>[] = [
  { value: "dnase", label: "DNase" },
  { value: "atac", label: "ATAC" },
  { value: "ctcf", label: "CTCF" },
  { value: "h3k27ac", label: "H3K27ac" },
  { value: "h3k4me3", label: "H3K4me3" },
];

export const CONSERVATION_OPTIONS: CheckboxOption<keyof Conservation>[] = [
  { value: "primate", label: "Primate" },
  { value: "mammal", label: "Mammal" },
  { value: "vertebrate", label: "Vertebrate" },
];
