import { createOtherTracksFolder } from "./shared/createFolder";
import humanData from "./data/human.json";
import { OtherTrackDataFile } from "./shared/types";

export const humanOtherTracksFolder = createOtherTracksFolder({
  id: "human-other-tracks",
  label: "Other Tracks",
  description: "Additional tracks",
  data: humanData as OtherTrackDataFile,
});
