/** SCREEN's study data already includes LD relationships; no per-hover API request is needed. */
export type LDSnp = {
  snpid: string;
  chromosome: string;
  start: number;
  stop: number;
  ldblocksnpid: string;
  rsquare: string;
  ldblock?: number;
  studyid?: string;
};
export type LDConnection = { source: LDSnp; target: LDSnp; rSquared: number | undefined };
export const isLead = (snp: LDSnp) => snp.ldblocksnpid.includes("Lead") || snp.rsquare.includes("*");

export function ldConnections(snps: readonly LDSnp[], activeIds: readonly string[]): LDConnection[] {
  const active = new Set(activeIds);
  const byId = new Map(snps.map((snp) => [snp.snpid, snp]));
  const connections = new Map<string, LDConnection>();
  for (const source of snps) {
    const scores = source.rsquare.split(",");
    source.ldblocksnpid.split(",").forEach((targetId, index) => {
      const target = byId.get(targetId.trim());
      if (!target || target === source || !(active.has(source.snpid) || active.has(target.snpid))) return;
      const score = Number.parseFloat(scores[index] ?? scores[0]);
      const key = [source.snpid, target.snpid].sort().join(":");
      connections.set(key, { source, target, rSquared: Number.isFinite(score) ? score : undefined });
    });
  }
  return [...connections.values()];
}
