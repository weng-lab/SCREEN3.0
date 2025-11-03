/**
 * These are where the universal shared types should be kept
 */

import { CCRE_ASSAYS, CCRE_CLASSES } from "common/consts";

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type Assembly = "GRCh38" | "mm10";

export type CcreClass = (typeof CCRE_CLASSES)[number];

// Generate type guards
export const isValidAssembly = (value: string): value is Assembly => value === "GRCh38" || value === "mm10";

export type CcreAssay = (typeof CCRE_ASSAYS)[number];
