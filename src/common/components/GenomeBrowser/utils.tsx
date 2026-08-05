import { Chromosome, Vibrant } from "@weng-lab/genomebrowser";
import { Result } from "@weng-lab/ui-components";
import { AnyEntityType } from "common/entityTabsConfig";
import { GenomicRange } from "common/types/globalTypes";
import { useMemo } from "react";

export function randomColor() {
  const idx = Math.floor(Math.random() * Vibrant.length);
  return Vibrant[idx];
}

export const SearchToScreenTypes: Partial<Record<Result["type"], AnyEntityType>> = {
  Coordinate: "region",
  Gene: "gene",
  SNP: "variant",
  Study: "gwas",
  cCRE: "ccre",
  iCRE: "ccre",
  "Legacy cCRE": "ccre",
};

const expansionPercentages: Record<AnyEntityType, number> = {
  ccre: 20,
  gene: 0.2,
  variant: 5.0,
  region: 0,
  gwas: 0.2,
  bed: 0,
};

export function expandCoordinates(coordinates: GenomicRange, type: AnyEntityType) {
  let length = coordinates.end - coordinates.start;

  if (length <= 100) {
    length = 100;
  }

  const expansionPercentage = expansionPercentages[type];
  const padding = Math.floor(length * expansionPercentage);

  return {
    chromosome: coordinates.chromosome as Chromosome,
    start: Math.max(0, coordinates.start - padding),
    end: coordinates.end + padding,
  };
}

/**
 * Narrows any region-shaped value to a GenomicRange whose identity only changes when the
 * chromosome/start/end values do.
 *
 * The data hooks rebuild region objects on every render, and GenomeBrowserView's GWAS effect calls
 * setDomain whenever the `coordinates` reference changes. Without this, an upstream data update
 * would hand the browser a new-but-equal object and snap the view back, discarding the user's pan
 * and zoom.
 */
export function useStableCoordinates(
  region: { chromosome?: string; start?: number; end?: number } | null | undefined
): GenomicRange | null {
  const chromosome = region?.chromosome;
  const start = region?.start;
  const end = region?.end;

  return useMemo(() => (chromosome === undefined ? null : { chromosome, start, end }), [chromosome, start, end]);
}
