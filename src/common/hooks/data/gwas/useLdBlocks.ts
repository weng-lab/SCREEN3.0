import { useMemo } from "react";
import type { UseGWASSnpsReturn } from "./useGWASSnpsData";

/** A GWAS study's LD block, aggregated from the coordinates of the SNPs it contains */
export type LdBlock = {
  ldblock: number;
  chromosome: string;
  start: number;
  end: number;
};

/**
 * Collapses a study's SNPs into the LD blocks they belong to, sorted by block number.
 *
 * A derivation rather than a fetch — callers pass in the result of useGWASSnpsData and keep
 * whatever loading and error handling they need from it.
 */
export const useLdBlocks = (snps: UseGWASSnpsReturn["data"]): LdBlock[] => {
  return useMemo(() => {
    const blocks = new Map<number, LdBlock>();

    for (const { ldblock, chromosome, start, stop } of snps ?? []) {
      const block = blocks.get(ldblock);

      if (!block) {
        blocks.set(ldblock, { ldblock, chromosome, start, end: stop });
      } else {
        block.start = Math.min(block.start, start);
        block.end = Math.max(block.end, stop);
      }
    }

    return Array.from(blocks.values()).sort((a, b) => a.ldblock - b.ldblock);
  }, [snps]);
};
