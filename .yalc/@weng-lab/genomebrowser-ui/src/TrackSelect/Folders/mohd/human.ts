import humanData from "./data/human.json";
import { createMohdFolder } from "./shared/createFolder";
import { MohdDataFile } from "./shared/types";

export const humanMohdFolder = createMohdFolder({
  id: "human-mohd",
  label: "MOHD",
  description: "Public MOHD signal, methylation, and annotation tracks.",
  data: humanData as MohdDataFile,
});
