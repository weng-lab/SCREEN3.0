import { Chromosome, createBrowserStoreMemo, InitialBrowserState } from "@weng-lab/genomebrowser";
import { AnyEntityType } from "common/entityTabsConfig";
import { getLocalBrowser, setLocalBrowser } from "common/hooks/useLocalStorage";
import { GenomicRange } from "common/types/globalTypes";
import { useEffect, useMemo } from "react";
import { expandCoordinates, randomColor } from "../utils";

/**
 * Pass entity name/id and coordinates to get back the browser and track stores.
 * Will first check local storage for any saved browser and track state before
 * re-creating them from scratch.
 * @param name the entity's id/name
 * @param coordinates the entity's genomic coordinates
 * @returns a browser store instance
 */
export default function useLocalBrowser(name: string, coordinates: GenomicRange, type: AnyEntityType) {
  const localBrowser = useMemo(() => getLocalBrowser(name), [name]);
  const currentDomain =
    localBrowser?.domain != null
      ? localBrowser?.domain
      : expandCoordinates(
          {
            chromosome: coordinates.chromosome as Chromosome,
            start: coordinates.start,
            end: coordinates.end,
          },
          type
        );

  const initialBrowserState: InitialBrowserState = {
    domain: currentDomain,
    highlights: localBrowser?.highlights || [
      {
        color: randomColor(),
        domain: {
          chromosome: coordinates.chromosome as Chromosome,
          start: coordinates.start,
          end: coordinates.end,
        },
        id: name,
      },
    ],
    trackWidth: 1400,
    marginWidth: 100,
    multiplier: 3,
  };

  const browserStore = createBrowserStoreMemo(initialBrowserState, [localBrowser]);

  const domain = browserStore((state) => state.domain);
  const highlights = browserStore((state) => state.highlights);

  useEffect(() => {
    setLocalBrowser(name, { domain: domain, highlights: highlights });
  }, [name, domain, highlights]);

  return browserStore;
}
