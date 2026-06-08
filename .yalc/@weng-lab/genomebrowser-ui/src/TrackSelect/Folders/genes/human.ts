import { createGeneFolder } from "./shared/createFolder";
import humanData from "./data/human.json";
import { GeneDataFile } from "./shared/types";

/**
 * Gene annotations folder for human (GRCh38 assembly)
 *
 * Contains gene annotation tracks like GENCODE that users can
 * select to display in the genome browser.
 */
export const humanGenesFolder = createGeneFolder({
  id: "human-genes",
  label: "Genes",
  description: "Gene annotation tracks",
  data: humanData as GeneDataFile,
});
