import type { GenomicRegion } from "@weng-lab/genomebrowser";
import { createGenomicXScale } from "@weng-lab/genomebrowser-tracks/shared";
import { isLead, ldConnections, type LDSnp } from "./ldData";

const labelGap = 4;
const labelHeight = 14;

type LabelAnchor = {
  key: string;
  rSquared: number;
  midpointX: number;
  labelY: number;
  width: number;
};
type PlacedLabel = LabelAnchor & { labelX: number; baseline: number };

// Keep the placement order separately: it determines candidate order and breaks distance ties.
function insertionIndex(labels: readonly PlacedLabel[], x: number) {
  let low = 0;
  let high = labels.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (labels[middle].labelX < x) low = middle + 1;
    else high = middle;
  }
  return low;
}

function placeLabels(labels: readonly LabelAnchor[], width: number, height: number): PlacedLabel[] {
  const placedLabels: PlacedLabel[] = [];
  const byX: PlacedLabel[] = [];
  let maxWidth = 0;

  function collides(x: number, y: number, labelWidth: number) {
    const middle = insertionIndex(byX, x);
    const reach = (labelWidth + maxWidth) / 2 + labelGap;
    // Only nearby centers can overlap, regardless of row. Use the original strict comparisons
    // so touching edges, fractional coordinates, and varying label widths retain their behavior.
    for (const direction of [-1, 1]) {
      for (let i = direction === -1 ? middle - 1 : middle; i >= 0 && i < byX.length; i += direction) {
        const placed = byX[i];
        const distance = Math.abs(x - placed.labelX);
        if (distance >= reach) break;
        if (
          distance < (labelWidth + placed.width) / 2 + labelGap &&
          Math.abs(y - placed.baseline) < labelHeight + labelGap
        )
          return true;
      }
    }
    return false;
  }

  for (const label of [...labels].sort((a, b) => a.midpointX - b.midpointX)) {
    const baseline = Math.max(10, Math.min(height - 4, label.labelY));
    const candidateXs = [
      Math.max(label.width / 2, Math.min(width - label.width / 2, label.midpointX)),
      ...placedLabels.flatMap((placed) => [
        placed.labelX + (placed.width + label.width) / 2 + labelGap,
        placed.labelX - (placed.width + label.width) / 2 - labelGap,
      ]),
    ].filter((x) => x - label.width / 2 >= 0 && x + label.width / 2 <= width);
    let best: { labelX: number; baseline: number } | undefined;
    let bestDistance = Infinity;
    for (let row = 0; row * (labelHeight + labelGap) <= height; row++) {
      for (const direction of row === 0 ? [1] : [-1, 1]) {
        const candidateY = baseline + direction * row * (labelHeight + labelGap);
        if (candidateY < 10 || candidateY + 4 > height) continue;
        for (const candidateX of candidateXs) {
          if (collides(candidateX, candidateY, label.width)) continue;
          const distance = Math.hypot(candidateX - label.midpointX, candidateY - baseline);
          if (distance >= bestDistance) continue;
          // Strictly nearer wins, retaining the first candidate on ties without collecting/sorting.
          best = { labelX: candidateX, baseline: candidateY };
          bestDistance = distance;
        }
      }
    }
    // If the track is full, keep the arc; its SNP tooltip still provides the score.
    if (best) {
      const placed = { ...label, ...best };
      placedLabels.push(placed);
      byX.splice(insertionIndex(byX, placed.labelX), 0, placed);
      maxWidth = Math.max(maxWidth, label.width);
    }
  }
  return placedLabels;
}

/** Geometry uses the shared browser's render region/width, including overscan, not its viewport. */
export function layoutLD({
  snps: data,
  activeIds,
  region,
  width,
  height,
}: {
  snps: readonly LDSnp[];
  activeIds: readonly string[];
  region: GenomicRegion;
  width: number;
  height: number;
}) {
  const x = createGenomicXScale(region, width);
  const visible = data.filter(
    (snp) => snp.chromosome === region.chromosome && snp.stop > region.start && snp.start < region.end
  );
  const y = (snp: LDSnp) => height * (isLead(snp) ? 1 / 3 : 2 / 3);
  const snps = visible.map((snp) => ({
    snp,
    lead: isLead(snp),
    x: x(snp.start) - 2,
    y: y(snp),
    width: Math.max(4, x(snp.stop) - x(snp.start) + 4),
    height: height - y(snp),
  }));
  const anchors: LabelAnchor[] = [];
  const arcs = ldConnections(visible, activeIds).map(({ source, target, rSquared }) => {
    const a = x((source.start + source.stop) / 2);
    const b = x((target.start + target.stop) / 2);
    const sourceY = y(source);
    const targetY = y(target);
    const midpointX = (a + b) / 2;
    const controlY = Math.min(sourceY, targetY) - height / 6;
    const key = `${source.snpid}:${target.snpid}`;
    if (rSquared != null) {
      // Evaluate the quadratic curve at t = 0.5 to keep the score beside its arc.
      const labelY = (sourceY + 2 * controlY + targetY) / 4 - 3;
      anchors.push({ key, rSquared, midpointX, labelY, width: String(rSquared).length * 6 + 6 });
    }
    return {
      key,
      path: `M ${a} ${sourceY} Q ${midpointX} ${controlY} ${b} ${targetY}`,
      strokeWidth: rSquared == null ? 4 : 1 + 7 * Math.max(0, Math.min(1, (rSquared - 0.7) / 0.3)),
    };
  });
  const labels = placeLabels(anchors, width, height).map(
    ({ key, rSquared, midpointX, labelY, labelX, baseline, width: labelWidth }) => ({
      key,
      rSquared,
      labelX,
      baseline,
      background: { x: labelX - labelWidth / 2, y: baseline - 10, width: labelWidth, height: labelHeight },
      leader:
        Math.abs(labelX - midpointX) > labelGap || Math.abs(baseline - labelY) > labelGap
          ? { x1: midpointX, y1: labelY + 3, x2: labelX, y2: baseline - 3 }
          : undefined,
    })
  );
  return { snps, arcs, labels };
}
