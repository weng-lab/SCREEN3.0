import { useQuery } from "@apollo/client";
import { BigBedConfig, BigWigConfig, DisplayMode, Rect, Track, TrackStoreInstance, TrackType } from "@weng-lab/genomebrowser";
import { RegistryBiosamplePlusRNA } from "common/components/BiosampleTables/types";
import { useEffect, useMemo } from "react";
import { gql } from "types/generated";
import { CCRE_TRACK_COLOR } from "../constants";
import { Assembly } from "types/globalTypes";
import { ASSAY_COLORS } from "common/colors";

const FETCH_RNASEQ_TRACKS = gql(`
  query fetchRNASeqData($assembly: String!, $biosample: [String]) {
    rnaSeqQuery(assembly: $assembly, biosample: $biosample) {
      expid
      biosample
      posfileid
      negfileid
      unstrandedfileid
    }
  }
`);



export const useBiosampleTracks = (
  assembly: Assembly,
  selectedBiosamples: RegistryBiosamplePlusRNA[] | null,
  trackStore: TrackStoreInstance,
  onHover: (item: Rect) => void,
  onLeave: (item: Rect) => void,
  onClick: (item: Rect) => void,
) => {
  const insertTrack = trackStore((state) => state.insertTrack);
  const currentTracks = trackStore((state) => state.tracks);
  const removeTrack = trackStore((state) => state.removeTrack);

  const biosampleNames = useMemo(
    () =>
      selectedBiosamples && selectedBiosamples.some((b) => b.rnaseq)
        ? selectedBiosamples.map((b) => b.name) // adjust if biosample key is different
        : null,
    [selectedBiosamples]
  );

  const { data, loading, error } = useQuery(FETCH_RNASEQ_TRACKS, {
    variables: { assembly: assembly.toLowerCase(), biosample: biosampleNames },
    skip: !biosampleNames,
  });

  const tracks: Track[] = useMemo(() => {
    if (!selectedBiosamples || loading) return [];

    const newTracks: Track[] = [];

    for (const biosample of selectedBiosamples) {
      // Get available signal accessions (remove null values)
      const signals = [
        biosample.dnase_signal,
        biosample.h3k4me3_signal,
        biosample.h3k27ac_signal,
        biosample.ctcf_signal,
      ].filter((signal): signal is string => !!signal);

      if (signals.length > 0) {
        const bigBedUrl = `https://downloads.wenglab.org/Registry-V4/${signals.join("_")}.bigBed`;

        const ccreTrack: BigBedConfig = {
          id: `biosample-ccre-${biosample.name}`,
          title: `cCREs in ${biosample.displayname}`,
          titleSize: 12,
          trackType: TrackType.BigBed,
          displayMode: DisplayMode.Dense,
          color: CCRE_TRACK_COLOR,
          height: 20,
          url: bigBedUrl,
          onHover,
          onLeave,
          onClick,
        };
        newTracks.push(ccreTrack);
      }

      if (biosample.dnase_signal) {
        newTracks.push({
          id: `biosample-dnase-${biosample.name}`,
          title: `DNase-seq signal in ${biosample.displayname}`,
          titleSize: 12,
          trackType: TrackType.BigWig,
          displayMode: DisplayMode.Full,
          color: ASSAY_COLORS.dnase,
          height: 50,
          url: `https://www.encodeproject.org/files/${biosample.dnase_signal}/@@download/${biosample.dnase_signal}.bigWig`,
        } as BigWigConfig);
      }

      if (biosample.h3k4me3_signal) {
        newTracks.push({
          id: `biosample-h3k4me3-${biosample.name}`,
          title: `H3K4me3 ChIP-seq signal in ${biosample.displayname}`,
          titleSize: 12,
          trackType: TrackType.BigWig,
          displayMode: DisplayMode.Full,
          color: ASSAY_COLORS.h3k4me3,
          height: 50,
          url: `https://www.encodeproject.org/files/${biosample.h3k4me3_signal}/@@download/${biosample.h3k4me3_signal}.bigWig`,
        } as BigWigConfig);
      }

      if (biosample.h3k27ac_signal) {
        newTracks.push({
          id: `biosample-h3k27ac-${biosample.name}`,
          title: `H3K27ac ChIP-seq signal in ${biosample.displayname}`,
          titleSize: 12,
          trackType: TrackType.BigWig,
          displayMode: DisplayMode.Full,
          color: ASSAY_COLORS.h3k27ac,
          height: 50,
          url: `https://www.encodeproject.org/files/${biosample.h3k27ac_signal}/@@download/${biosample.h3k27ac_signal}.bigWig`,
        } as BigWigConfig);
      }

      if (biosample.ctcf_signal) {
        newTracks.push({
          id: `biosample-ctcf-${biosample.name}`,
          title: `CTCF ChIP-seq signal in ${biosample.displayname}`,
          titleSize: 12,
          trackType: TrackType.BigWig,
          displayMode: DisplayMode.Full,
          color: ASSAY_COLORS.ctcf,
          height: 50,
          url: `https://www.encodeproject.org/files/${biosample.ctcf_signal}/@@download/${biosample.ctcf_signal}.bigWig`,
        } as BigWigConfig);
      }
    }

    return newTracks;
  }, [selectedBiosamples, loading, onHover, onLeave, onClick]);
  const rnaTracks: Track[] = useMemo(() => {
    if (!biosampleNames || loading || error || !data?.rnaSeqQuery) return [];
    const tracks: Track[] = [];
    data.rnaSeqQuery.forEach((entry: any) => {
      const { expid, biosample, posfileid, negfileid, unstrandedfileid } = entry;
      
      const makeTrack = (expid: string, fileId: string, strand: string, color: string) => {
        return {
          id: `rnaseq_${expid}-${fileId}-${strand}`,
          title: `RNA-seq ${strand} strand signal of unique reads rep 1 ${expid} ${fileId} in ${selectedBiosamples.find(b=>b.name===biosample).displayname}`,
          height: 50,
          titleSize: 12,
          trackType: TrackType.BigWig,
          color,
          url: `https://www.encodeproject.org/files/${fileId}/@@download/${fileId}.bigWig?proxy=true`,
          displayMode: DisplayMode.Full,
        } as BigWigConfig;
      };

      if (posfileid) tracks.push(makeTrack(expid, posfileid, "plus", "#00AA00"));
      if (negfileid) tracks.push(makeTrack(expid, negfileid, "minus", "#00AA00"));
      if (unstrandedfileid) tracks.push(makeTrack(expid, unstrandedfileid, "unstranded", "#00AA00"));
    });

    return tracks;
  }, [biosampleNames, loading, error, data, selectedBiosamples]);

  useEffect(() => {
    [...tracks, ...rnaTracks].forEach((track) => {
      if (!currentTracks.some((t) => t.id === track.id)) {
        insertTrack(track);
      }
    });

    currentTracks.forEach((track) => {
      if (track.id.includes("rnaseq_") && !rnaTracks.some((t) => t.id === track.id)) {
        removeTrack(track.id);
      }
      if (track.id.includes("biosample-") && !tracks.some((t) => t.id === track.id)) {
        removeTrack(track.id);
      }
    });
  }, [rnaTracks, tracks, insertTrack, removeTrack, currentTracks]);
}