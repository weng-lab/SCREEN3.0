/**
 * These are where the universal shared types should be kept
 */

export interface GenomicRange {
  chromosome: string;
  start: number;
  end: number;
}

export type Assembly = "GRCh38" | "mm10"

// Generate type guards
export const isValidAssembly = (value: string): value is Assembly => 
  value === "GRCh38" || value === "mm10";