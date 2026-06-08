import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  InferBigBedRow,
  MethylCConfig,
  Track,
  TrackType,
  ValuedPoint,
} from "@weng-lab/genomebrowser";
import type { FC } from "react";
import { CreateTrackOptions } from "../../types";
import {
  getMohdBigBedSchema,
  mohdAtacFdrPeaksSchema,
  mohdAtacPseudorepPeaksSchema,
} from "./bigBedSchemas";
import { createMohdFileUrl, getMohdOmeConfig } from "./config";
import { MohdBigBedTooltip } from "./MohdBigBedTooltip";
import { MohdRowInfo } from "./types";

export type MohdTrackContext = {
  mohdSignalTooltip?: FC<ValuedPoint[]>;
  mohdMethylTooltip?: FC<ValuedPoint[]>;
};

const defaultBigWig: Omit<BigWigConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigWig,
  height: 30,
  displayMode: DisplayMode.Full,
  titleSize: 12,
  color: "#02c7b9",
};

const defaultBigBed: Omit<BigBedConfig, "id" | "title" | "url"> = {
  trackType: TrackType.BigBed,
  height: 20,
  displayMode: DisplayMode.Dense,
  titleSize: 12,
};

const defaultMethylC: Omit<MethylCConfig, "id" | "title" | "urls"> = {
  trackType: TrackType.MethylC,
  height: 75,
  displayMode: DisplayMode.Split,
  titleSize: 12,
  color: "#648bd8",
  maskCpgByCoverage: true,
  colors: {
    cpg: "#648bd8",
    chg: "#ff944d",
    chh: "#ff00ff",
    depth: "#525252",
  },
};

type MohdBigBedRow =
  | InferBigBedRow<typeof mohdAtacFdrPeaksSchema>
  | InferBigBedRow<typeof mohdAtacPseudorepPeaksSchema>;

function createTrackTitle(row: MohdRowInfo) {
  return `${row.sampleId} ${row.description}`;
}

export function createMohdTrack(
  row: MohdRowInfo,
  options: CreateTrackOptions,
): Track | null {
  const trackContext = options.trackContext;

  if (row.kind === "wgbs-methyl") {
    return {
      ...defaultMethylC,
      id: row.id,
      title: createTrackTitle(row),
      tooltip: trackContext?.mohdMethylTooltip,
      urls: {
        plusStrand: {
          cpg: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.plusStrand.cpg,
            }),
          },
          chg: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.plusStrand.chg,
            }),
          },
          chh: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.plusStrand.chh,
            }),
          },
          depth: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.plusStrand.depth,
            }),
          },
        },
        minusStrand: {
          cpg: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.minusStrand.cpg,
            }),
          },
          chg: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.minusStrand.chg,
            }),
          },
          chh: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.minusStrand.chh,
            }),
          },
          depth: {
            url: createMohdFileUrl({
              ome: row.ome,
              sampleId: row.sampleId,
              filename: row.filenames.minusStrand.depth,
            }),
          },
        },
      },
    };
  }

  if (row.kind !== "file") {
    return null;
  }

  const { color } = getMohdOmeConfig(row.ome);
  const url = createMohdFileUrl({
    ome: row.ome,
    sampleId: row.sampleId,
    filename: row.filename,
  });

  if (row.filename.endsWith(".bigWig")) {
    return {
      ...defaultBigWig,
      id: row.id,
      title: createTrackTitle(row),
      url,
      color,
      tooltip: trackContext?.mohdSignalTooltip,
    };
  }

  if (row.filename.endsWith(".bigBed")) {
    return {
      ...defaultBigBed,
      id: row.id,
      title: createTrackTitle(row),
      url,
      color,
      schema: getMohdBigBedSchema(row),
      tooltip: MohdBigBedTooltip,
      onClick: (rect: MohdBigBedRow) => {
        console.log(rect);
      },
    };
  }

  return null;
}
