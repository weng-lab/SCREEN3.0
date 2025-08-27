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

/**
 * Couldn't figure out how to generate this properly based off of the tab config object
 */

export const validEntityTypes = {
  GRCh38: ["ccre", "gene", "variant", "region"],
  mm10: ["ccre", "gene", "variant", "region"]
} as const;

export type EntityType<A extends Assembly> = typeof validEntityTypes[A][number]

export const isValidEntityType = <A extends Assembly>(assembly: A, entityType: string): entityType is EntityType<A> => {
  return (validEntityTypes[assembly] as readonly string[]).includes(entityType)
}