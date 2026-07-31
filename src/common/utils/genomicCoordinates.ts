import type { GenomicRange } from "common/types/globalTypes";

/**
 * Converts input coordinate string into GenomicRange. Handles commas in coordinates and "%3A" URI encoding of ":"
 * @param input `String` with format chr:start-end
 * @returns `GenomicRange`
 */
export function parseGenomicRangeString(input: string): GenomicRange {
  const separator = input.includes("%3A") ? "%3A" : ":";
  const [chromosome, rangeStr] = input.split(separator);
  const [startStr, endStr] = rangeStr.split("-");

  return {
    chromosome,
    start: +startStr.replace(/,/g, ""),
    end: +endStr.replace(/,/g, ""),
  };
}

/**
 *
 * @param region GenomicRange
 * @returns formatted string representing the range
 */
export function formatGenomicRange(region: GenomicRange) {
  return `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
}

/**
 *
 * @param region {chrom, start, end}
 * @param transcripts
 * @returns distance to nearest TSS from the middle of input cCRE, closest transcriptID, and upstream/downstream indicator.
 *
 * Assumes that cCRE and TSS are on same chromosome
 */
export function calcDistCcreToTSS(
  region: GenomicRange,
  transcripts: { id: string; coordinates: GenomicRange }[],
  strand: "+" | "-",
  anchor: "middle" | "closest"
): { transcriptId: string; distance: number; direction: "Upstream" | "Downstream" } {
  const results = transcripts.map((transcript) => {
    const tss = strand === "+" ? transcript.coordinates.start : transcript.coordinates.end;
    const distance = calcDistRegionToPosition(region.start, region.end, anchor, tss);

    const middle = Math.floor(region.start + region.end) / 2;

    let direction: "Upstream" | "Downstream";
    if (strand === "+") {
      direction = middle < tss ? "Upstream" : "Downstream";
    } else {
      direction = middle > tss ? "Upstream" : "Downstream";
    }

    return {
      transcriptId: transcript.id,
      distance,
      direction,
    };
  });

  return results.reduce((closest, curr) => (curr.distance < closest.distance ? curr : closest));
}

export function ccreOverlapsTSS(
  region: GenomicRange,
  transcripts: { id: string; coordinates: GenomicRange }[],
  strand: "+" | "-"
): boolean {
  const distances: number[] = transcripts.map((transcript) => {
    const tss = strand === "+" ? transcript.coordinates.start : transcript.coordinates.end;
    return calcDistRegionToRegion(region, { start: tss, end: tss });
  });

  return distances.includes(0);
}

/**
 *
 * @param start Start of Region
 * @param end End of Region
 * @param anchor The anchor of region to be used: start, end, middle, or closest (finds minimum of all anchors)
 * @param point Point to Find Distance to
 * @returns The distance from the anchor specified to the position
 */
export function calcDistRegionToPosition(
  start: number,
  end: number,
  anchor: "closest" | "start" | "end" | "middle",
  point: number
): number {
  const distToStart = Math.abs(start - point);
  const distToEnd = Math.abs(end - point);
  const distToMiddle = Math.abs(Math.floor((start + end) / 2) - point);

  if (start <= point && point <= end) {
    return 0;
  }

  switch (anchor) {
    case "start":
      return distToStart;
    case "end":
      return distToEnd;
    case "middle":
      return distToMiddle;
    case "closest":
      return Math.min(distToStart, distToEnd, distToMiddle);
  }
}

/**
 * @todo why do we have two versions basically doing the same thing instead of one + a Math.abs()
 */

/**
 * Returns the signed distance from coord1 to coord2.
 */
export function calcSignedDistRegionToRegion(
  coord1: { start: number; end: number },
  coord2: { start: number; end: number }
): number {
  if (coord2.end < coord1.start) {
    return coord2.end - coord1.start;
  } else if (coord2.start > coord1.end) {
    return coord2.start - coord1.end;
  } else {
    return 0;
  }
}

/**
 *
 * @param coord1
 * @param coord2
 * @returns the smallest distance from any point in either region
 */
export function calcDistRegionToRegion(
  coord1: { start: number; end: number },
  coord2: { start: number; end: number }
): number {
  if (coord1.end < coord2.start) {
    return coord2.start - coord1.end;
  } else if (coord2.end < coord1.start) {
    return coord1.start - coord2.end;
  } else {
    return 0;
  }
}
