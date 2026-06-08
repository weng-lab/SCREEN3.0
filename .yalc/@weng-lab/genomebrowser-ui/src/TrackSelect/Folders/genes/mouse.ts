import { createGeneFolder } from "./shared/createFolder";
import mouseData from "./data/mouse.json";
import { GeneDataFile } from "./shared/types";

/**
 * Gene annotations folder for human (GRCh38 assembly)
 *
 * Contains gene annotation tracks like GENCODE that users can
 * select to display in the genome browser.
 */
export const mouseGenesFolder = createGeneFolder({
  id: "mouse-genes",
  label: "Genes",
  description: "Gene annotation tracks",
  data: mouseData as GeneDataFile,
});
