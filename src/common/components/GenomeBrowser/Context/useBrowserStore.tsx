import {
  BigWigConfig,
  Chromosome,
  createBrowserStoreMemo,
  createTrackStoreMemo,
  DisplayMode,
  InitialBrowserState,
  TrackType,
} from "@weng-lab/genomebrowser";
import { ASSAY_COLORS } from "common/colors";
import { getLocalBrowser } from "common/hooks/useLocalStorage";
import { GenomicRange } from "common/types/globalTypes";
import { expandCoordinates } from "../utils";
import { AnyEntityType } from "common/entityTabsConfig";

/**
 * Pass entity name/id and coordinates to get back the browser and track stores.
 * Will first check local storage for any saved browser and track state before
 * re-creating them from scratch.
 * @param name the entity's id/name
 * @param coordinates the entity's genomic coordinates
 * @returns
 */
export default function useLocalBrowser(name: string, coordinates: GenomicRange, type: AnyEntityType) {
  // Get local browser state first, fallback on provided coordinates
  const localBrowser = getLocalBrowser(name);
  const domain = localBrowser?.domain || {
    chromosome: coordinates.chromosome as Chromosome,
    start: coordinates.start,
    end: coordinates.end,
  };

  // Initialize browser store state
  const initialBrowserState: InitialBrowserState = {
    domain: expandCoordinates(domain, type),
    highlights: localBrowser?.highlights || [],
    trackWidth: 1400,
    marginWidth: 100,
    multiplier: 3,
  };

  const browserStore = createBrowserStoreMemo(initialBrowserState, [localBrowser]);

  // Initialize track store with interaction functions (on click, on hover, etc)
  const trackStore = createTrackStoreMemo(
    [
      {
        id: "gene-track",
        title: "GENCODE Genes",
        trackType: TrackType.Transcript,
        displayMode: DisplayMode.Squish,
        color: "#2E8B57",
        height: 100,
        assembly: "GRCh38",
        version: 40,
      },
      {
        id: "default-dnase",
        title: "Agregated DNase-seq signal, all Registry biosamples",
        titleSize: 12,
        trackType: TrackType.BigWig,
        displayMode: DisplayMode.Full,
        color: ASSAY_COLORS.dnase,
        height: 50,
        url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
      } as BigWigConfig,
    ],
    []
  );

  const saveBrowser = () => {};
  const saveTracks = () => {};

  return { browserStore, trackStore, saveBrowser, saveTracks };
}
