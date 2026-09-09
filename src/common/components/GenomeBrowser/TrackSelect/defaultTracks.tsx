import { geneModule, type GeneInteractionTarget } from "@weng-lab/genomebrowser-tracks/gene";
import { ccreBigBedModule } from "@weng-lab/genomebrowser-tracks/ccre";
import type { AnyTrackInstance, TrackInteraction } from "@weng-lab/genomebrowser";
import type { BigBedRow } from "@weng-lab/genomebrowser-tracks/bigbed";
import { ldModule } from "../modules/ld";
import { HUMAN_GENE_URL, isCcreUrl } from "./collections";

export function gwasTracks(studyId: string) {
  return [
    geneModule.create({
      id: "screen-gwas-genes",
      title: "GENCODE v40 Genes",
      display: "merged",
      color: "#0c184a",
      source: "host",
      config: { url: HUMAN_GENE_URL },
    }),
    ccreBigBedModule.create({
      id: "screen-gwas-ccres",
      title: "All cCREs colored by group",
      display: "dense",
      source: "host",
      config: { url: "https://downloads.wenglab.org/GRCh38-cCREs.DCC.bigBed" },
    }),
    ldModule.create({ id: "screen-gwas-ld", title: "LD", source: "host", config: { studyId } }),
  ];
}
export type TrackCallbacks = {
  regions: TrackInteraction<BigBedRow>;
  genes: TrackInteraction<GeneInteractionTarget>;
};
export function injectCallbacks(track: AnyTrackInstance, callbacks: TrackCallbacks): AnyTrackInstance {
  if (track.type === "gene") return { ...track, interaction: callbacks.genes };
  if (track.type === "ccre-bigbed" || (track.type === "bigbed" && isCcreUrl((track.config as { url?: string }).url)))
    return { ...track, interaction: callbacks.regions };
  // ChromHMM and TF peaks still highlight on hover, without navigating to a cCRE on click.
  if (["bigbed", "bulkbed", "screen-tf-peaks"].includes(track.type))
    return { ...track, interaction: { onHover: callbacks.regions.onHover, onLeave: callbacks.regions.onLeave } };
  return track;
}
