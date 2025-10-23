import { useEffect, useRef } from "react";
import { BulkBedConfig, DisplayMode, TrackStoreInstance, TrackType } from "@weng-lab/genomebrowser";
import { tissueColors } from "common/colors";
import { capitalizeFirstLetter } from "common/utility";
import { ChromHmmTooltip } from "./ChromHmmTooltip";
import { Rect } from "umms-gb/dist/components/tracks/bigbed/types";
import { useChromHMMData } from "common/hooks/useChromHmmData";
import { Assembly, GenomicRange } from "types/globalTypes";

type ChromHmmTracksData = Record<string, Array<{ displayName: string; url: string }>>;

function createChromHmmTrack(
  tissue: string,
  chromHmmTracks: ChromHmmTracksData,
  addHighlight: (highlight: { color: string; domain: { start: number; end: number }; id: string }) => void,
  removeHighlight: (id: string) => void
): BulkBedConfig {
  const tissueTracks = chromHmmTracks[tissue];

  return {
    id: `ChromHmm_${tissue}_bulkbed`,
    titleSize: 12,
    color: tissueColors[tissue] ?? tissueColors.missing,
    trackType: TrackType.BulkBed,
    displayMode: DisplayMode.Full,
    datasets: tissueTracks.map((sample) => ({
      name: sample.displayName,
      url: sample.url,
    })),
    title: `${capitalizeFirstLetter(tissue)} ChromHMM States`,
    height: 15 * tissueTracks.length,
    tooltip: (rect: Rect) => ChromHmmTooltip(rect, tissue, rect.name),
    onHover: (rect: Rect) => {
      addHighlight({
        color: rect.color,
        domain: { start: rect.start, end: rect.end },
        id: "tmp-bulkbed",
      });
    },
    onLeave: () => {
      removeHighlight("tmp-bulkbed");
    },
  };
}

export function useChromHmmTracks(
  selectedChromHmmTissues: string[],
  coordinates: GenomicRange,
  assembly: Assembly,
  trackStore: TrackStoreInstance,
  addHighlight: (highlight: { color: string; domain: { start: number; end: number }; id: string }) => void,
  removeHighlight: (id: string) => void
) {
  const { tracks: chromHmmTracks } = useChromHMMData(coordinates, assembly);

  const previousTissuesRef = useRef<string[]>([]);
  const insertTrack = trackStore((state) => state.insertTrack);
  const removeTrack = trackStore((state) => state.removeTrack);

  // Store highlight callbacks in refs to avoid re-running effect when they change
  const addHighlightRef = useRef(addHighlight);
  const removeHighlightRef = useRef(removeHighlight);

  useEffect(() => {
    addHighlightRef.current = addHighlight;
    removeHighlightRef.current = removeHighlight;
  }, [addHighlight, removeHighlight]);

  useEffect(() => {
    if (!chromHmmTracks) return;

    const previousTissues = previousTissuesRef.current;

    const addedTissues = selectedChromHmmTissues.filter((tissue) => !previousTissues.includes(tissue));
    const removedTissues = previousTissues.filter((tissue) => !selectedChromHmmTissues.includes(tissue));

    addedTissues.forEach((tissue) => {
      const track = createChromHmmTrack(tissue, chromHmmTracks, addHighlightRef.current, removeHighlightRef.current);
      console.log("inserting track", track.id);
      insertTrack(track);
    });

    removedTissues.forEach((tissue) => {
      const trackId = `ChromHmm_${tissue}_bulkbed`;
      console.log("removing track", trackId);
      removeTrack(trackId);
    });

    previousTissuesRef.current = selectedChromHmmTissues;
  }, [selectedChromHmmTissues, chromHmmTracks, insertTrack, removeTrack]);
}
