import type { Distribution } from "@weng-lab/visualization";
import type { Dispatch, SetStateAction } from "react";

export type ViolinSortBy = "median" | "max" | "tissue";

/** Sort distributions by tissue name, median value, or max value */
export function sortDistributions<T>(distributions: Distribution<T>[], sortBy: ViolinSortBy): void {
  distributions.sort((a, b) => {
    if (sortBy === "tissue") {
      return a.label.localeCompare(b.label);
    }
    if (sortBy === "median") {
      const median = (arr: number[]) => {
        const sorted = arr.toSorted((x, y) => x - y);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      };
      return median(b.data.map((d) => d.value)) - median(a.data.map((d) => d.value));
    }
    if (sortBy === "max") {
      return Math.max(...b.data.map((d) => d.value)) - Math.max(...a.data.map((d) => d.value));
    }
    return 0;
  });
}

/** Toggle selection of all items in a violin distribution */
export function handleViolinToggle<T>(
  distribution: Distribution<T>,
  selected: T[],
  setSelected: Dispatch<SetStateAction<T[]>>,
  getRowId: (item: T) => string
): void {
  const rowsForDistribution = distribution.data.map((point) => point.metadata);

  const allInDistributionSelected = rowsForDistribution.every((row) =>
    selected.some((x) => getRowId(x) === getRowId(row))
  );

  if (allInDistributionSelected) {
    setSelected((prev) => prev.filter((row) => !rowsForDistribution.some((x) => getRowId(x) === getRowId(row))));
  } else {
    const toSelect = rowsForDistribution.filter((row) => !selected.some((x) => getRowId(x) === getRowId(row)));
    setSelected((prev) => [...prev, ...toSelect]);
  }
}
