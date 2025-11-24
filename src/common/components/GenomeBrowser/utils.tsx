import { Chromosome } from "@weng-lab/genomebrowser";
import { Result } from "@weng-lab/ui-components";
import { AnyEntityType } from "common/entityTabsConfig";
import { GenomicRange } from "common/types/globalTypes";

export function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export const SearchToScreenTypes: Record<Result["type"], AnyEntityType> = {
  Coordinate: "region",
  Gene: "gene",
  SNP: "variant",
  Study: "gwas",
  cCRE: "ccre",
  iCRE: "ccre",
};

const expansionPercentages: Record<AnyEntityType, number> = {
  ccre: 20,
  gene: 0.2,
  variant: 5.0,
  region: 0.25,
  gwas: 0.2,
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
