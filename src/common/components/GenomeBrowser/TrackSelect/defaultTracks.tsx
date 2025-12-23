import { BigBedConfig, BigWigConfig, Rect, TranscriptConfig } from "@weng-lab/genomebrowser";
import { defaultBigBed, defaultBigWig, defaultTranscript } from "./defaultConfigs";
import CCRETooltip from "../Tooltips/CcreTooltip";

export const geneTrack: TranscriptConfig = {
  ...defaultTranscript,
  color: "#D05F45",
  id: "human-genes-ignore",
  assembly: "GRCh38",
  version: 40,
};
export const ccreTrack: BigBedConfig = {
  ...defaultBigBed,
  id: "human-ccre-ignore",
  title: "All cCREs colored by group",
  url: "https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed",
  color: "#D05F45",
  tooltip: (rect: Rect) => <CCRETooltip assembly={"GRCh38"} name={rect.name} {...rect} />,
};
export const dnaseTrack: BigWigConfig = {
  ...defaultBigWig,
  color: "#D05F45",
  id: "human-dnase-aggregate-ignore",
  title: "Aggregated DNase signal, all ENCODE biosamples",
  url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
};
