import { Rect, Track } from "@weng-lab/genomebrowser";
import { defaultBigBed, defaultBigWig, defaultTranscript } from "./defaultConfigs";
import { CCRETooltip } from "../GenomeBrowser/Tooltips/CcreTooltip";

export const defaultHumanTracks: Track[] = [
  {
    ...defaultTranscript,
    id: "human-genes",
    assembly: "GRCh38",
    version: 40,
  },
  {
    ...defaultBigBed,
    id: "human-ccre",
    title: "All cCREs colored by group",
    url: "https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed",
    color: "#D05F45",
    tooltip: (rect: Rect) => <CCRETooltip assembly={"GRCh38"} name={rect.name} {...rect} />,
  },
  {
    ...defaultBigWig,
    id: "human-dnase-aggregate",
    title: "Aggregated DNase signal, all ENCODE biosamples",
    url: "",
  },
];
