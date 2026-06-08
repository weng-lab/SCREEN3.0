import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  MethylCConfig,
  Rect,
  Track,
  TrackType,
  ValuedPoint,
} from "@weng-lab/genomebrowser";
import type { FC } from "react";
import { CreateTrackOptions } from "../../types";
import { BiosampleRowInfo } from "./types";

export type BiosampleTrackContext = {
  onBiosampleFeatureClick?: (args: {
    trackId: string;
    row: BiosampleRowInfo;
    rect: Rect;
  }) => void;
  onBiosampleFeatureHover?: (args: {
    trackId: string;
    row: BiosampleRowInfo;
    rect: Rect;
  }) => void;
  biosampleFeatureTooltip?: FC<Rect>;
  biosampleSignalTooltip?: FC<ValuedPoint[]>;
  biosampleMethylTooltip?: FC<ValuedPoint[]>;
};

const assayColors: Record<string, string> = {
  dnase: "#06da93",
  h3k4me3: "#ff0000",
  h3k27ac: "#ffcd00",
  ctcf: "#00b0d0",
  atac: "#02c7b9",
  rnaseq: "#00aa00",
  chromhmm: "#00ff00",
  ccre: "#000000",
  wgbs: "#648bd8",
};

const defaultBigWig: Omit<BigWigConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigWig,
  height: 50,
  displayMode: DisplayMode.Full,
  titleSize: 12,
};

const defaultBigBed: Omit<BigBedConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigBed,
  height: 20,
  displayMode: DisplayMode.Dense,
  titleSize: 12,
};

const defaultMethylC: Omit<MethylCConfig, "id" | "title" | "urls"> = {
  trackType: TrackType.MethylC,
  height: 100,
  displayMode: DisplayMode.Split,
  titleSize: 12,
  color: "#648bd8",
  colors: {
    cpg: "#648bd8",
    chg: "#ff944d",
    chh: "#ff00ff",
    depth: "#525252",
  },
};

export function createBiosampleTrack(
  row: BiosampleRowInfo,
  options: CreateTrackOptions,
): Track {
  const assay = row.assay.toLowerCase();
  const color = assayColors[assay] ?? "#000000";
  const trackContext = options.trackContext;

  switch (assay) {
    case "chromhmm":
    case "ccre":
      return {
        ...defaultBigBed,
        id: row.id,
        url: row.url ?? "",
        title: row.displayName,
        color,
        onClick: trackContext?.onBiosampleFeatureClick
          ? (rect: Rect) =>
              trackContext.onBiosampleFeatureClick?.({
                trackId: row.id,
                row,
                rect,
              })
          : undefined,
        onHover: trackContext?.onBiosampleFeatureHover
          ? (rect: Rect) =>
              trackContext.onBiosampleFeatureHover?.({
                trackId: row.id,
                row,
                rect,
              })
          : undefined,
        tooltip: trackContext?.biosampleFeatureTooltip,
      };
    case "wgbs":
      return {
        ...defaultMethylC,
        id: row.id,
        title: row.displayName,
        maskCpgByCoverage: true,
        tooltip: trackContext?.biosampleMethylTooltip,
        urls: {
          plusStrand: {
            cpg: { url: row.cpgPlus ?? "" },
            chg: { url: "" },
            chh: { url: "" },
            depth: { url: row.coverage ?? "" },
          },
          minusStrand: {
            cpg: { url: row.cpgMinus ?? "" },
            chg: { url: "" },
            chh: { url: "" },
            depth: { url: row.coverage ?? "" },
          },
        },
      };
    default:
      return {
        ...defaultBigWig,
        id: row.id,
        url: row.url ?? "",
        title: row.displayName,
        color,
        tooltip: trackContext?.biosampleSignalTooltip,
      };
  }
}
