/** A GWAS study's LD block, aggregated from the coordinates of the SNPs it contains */
export type LdBlock = {
  ldblock: number;
  chromosome: string;
  start: number;
  end: number;
};
