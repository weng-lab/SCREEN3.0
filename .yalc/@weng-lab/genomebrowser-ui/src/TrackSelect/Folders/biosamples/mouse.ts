import { createBiosampleFolder } from "./shared/createFolder";
import mouseData from "./data/mouse.json";
import { BiosampleDataFile } from "./shared/types";

/**
 * Mouse biosamples folder configuration for mm10 assembly.
 *
 * Contains epigenomic data (DNase, ATAC, H3K4me3, H3K27ac, CTCF, cCRE, RNA-seq, ChromHMM)
 * from mouse tissue samples, primary cells, cell lines, and organoids.
 */
export const mouseBiosamplesFolder = createBiosampleFolder({
  id: "mouse-biosamples",
  label: "Mouse Biosamples",
  description:
    "Epigenomic data from mouse tissue samples, primary cells, cell lines, and organoids.",
  data: mouseData as BiosampleDataFile,
});
