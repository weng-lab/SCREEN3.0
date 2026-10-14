/** The sequential ramp shared with MOHD, and where it starts. */

import { percentileRange, type ColorRange } from "@weng-lab/visualization";

/** MOHD's embedding explorer ramp, stops as it has them. Its order is carried by hue: yellow is the lightest. */
export const SEQUENTIAL_RAMP = [
  { at: 0, color: "#2541b2" },
  { at: 0.34, color: "#35a6a0" },
  { at: 0.68, color: "#f6d55c" },
  { at: 1, color: "#d8422c" },
] as const;

/** Percentile trimmed off each end before the ramp is stretched across values. Values beyond take an end's color. */
export const CLIP_PERCENTILE = 2;

/** Where a sequential ramp's colors stop until the reader moves them: the middle 96% of the values. */
export const defaultRange = (sorted: ArrayLike<number>): ColorRange => percentileRange(sorted, CLIP_PERCENTILE);

/** Expression is colored on log10(value + 1), so a gene's spread over orders of magnitude isn't crushed to one end. */
export const toLogValue = (value: number) => Math.log10(value + 1);

export const fromLogValue = (log: number) => 10 ** log - 1;
