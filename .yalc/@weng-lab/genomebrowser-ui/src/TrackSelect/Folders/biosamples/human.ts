import { createBiosampleFolder } from "./shared/createFolder";
import humanData from "./data/humans_fixed.json";
import { BiosampleDataFile } from "./shared/types";

/**
 * Human biosamples folder configuration for GRCh38 assembly.
 *
 * Contains epigenomic data (DNase, ATAC, H3K4me3, H3K27ac, CTCF, cCRE, RNA-seq, ChromHMM)
 * from human tissue samples, primary cells, cell lines, and organoids.
 */
export const humanBiosamplesFolder = createBiosampleFolder({
  id: "human-biosamples",
  label: "Human Biosamples",
  description:
    "Epigenomic data from human tissue samples, primary cells, cell lines, and organoids.",
  data: humanData as BiosampleDataFile,
});
