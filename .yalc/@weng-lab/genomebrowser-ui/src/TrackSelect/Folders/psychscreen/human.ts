import { createPsychscreenFolder } from "./shared/createFolder";
import humanData from "./data/human.json";
import { PsychscreenDataFile } from "./shared/types";

export const humanPsychscreenFolder = createPsychscreenFolder({
  id: "human-psychscreen",
  label: "PsychSCREEN",
  description: "PsychSCREEN browser tracks",
  data: humanData as PsychscreenDataFile,
});
