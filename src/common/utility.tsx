import type { CcreAssay, CcreClass, GenomicRange } from "common/types/globalTypes";
import { Typography, TypographyOwnProps } from "@mui/material";
import pako from "pako";

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function capitalizeWords(input: string): string {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const truncateString = (input: string, maxLength: number) => {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + "...";
};

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
 * @param subpath
 * @returns A formatted portal name for the passed string. If no matching portal returns null
 */
export function formatPortal(subpath: string): string {
  switch (subpath) {
    case "variant":
      return "Variant";
    case "gene":
      return "Gene";
    case "ccre":
      return "cCRE";
    case "region":
      return "Region";
    case "gwas":
      return "GWAS";
    default:
      return null;
  }
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
 * @param assay
 * @returns Formatted assay name
 */
export const formatAssay = (assay: CcreAssay) => {
  switch (assay) {
    case "atac":
      return "ATAC";
    case "ctcf":
      return "CTCF";
    case "dnase":
      return "DNase";
    case "h3k27ac":
      return "H3K27ac";
    case "h3k4me3":
      return "H3K4me3";
  }
};

/**
 * Only use this function if use case is unable to handle jsx element and needs string. Use `toScientificNotationElement` if possible
 */
export function toScientificNotation(num: number, sigFigs?: number) {
  // Convert the number to scientific notation using toExponential
  const scientific = num.toExponential(sigFigs ?? undefined);

  // Split the scientific notation into the coefficient and exponent parts
  // eslint-disable-next-line prefer-const
  let [coefficient, exponent] = scientific.split("e");

  // Format the exponent part
  const expSign = exponent[0];
  exponent = exponent.slice(1);

  // Convert the exponent to a superscript string
  let superscriptExponent = exponent
    .split("")
    .map((char) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[char] || char)
    .join("");

  // Add the sign back to the exponent
  superscriptExponent = (expSign === "-" ? "⁻" : "") + superscriptExponent;

  // Combine the coefficient with the superscript exponent
  return coefficient + "×10" + superscriptExponent;
}

/**
 * @param num Number to convert to Sci Notation
 * @param sigFigs Number of desired significant figures
 * @param typographyProps Props spread onto Typography element
 * @returns
 */
export function toScientificNotationElement(num: number, sigFigs: number, typographyProps?: TypographyOwnProps) {
  if (num > 0.01) {
    return <Typography {...typographyProps}>{num.toFixed(2)}</Typography>;
  }

  // Convert the number to scientific notation using toExponential
  const scientific = num.toExponential(sigFigs);
  const [coefficient, exponent] = scientific.split("e");

  return (
    <Typography {...typographyProps}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
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
): { transcriptId: string; distance: number; direction: "Upstream" | "Downstream" } {
  const results = transcripts.map((transcript) => {
    const tss = strand === "+" ? transcript.coordinates.start : transcript.coordinates.end;
    const distance = calcDistRegionToPosition(region.start, region.end, "middle", tss);

    const middle = Math.floor(region.start + region.end) / 2

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

// Convert Uint8Array → binary string for btoa
function uint8ToBinaryString(uint8: Uint8Array): string {
  let binary = "";
  const len = uint8.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return binary;
}

// Convert binary string → Uint8Array for inflate
function binaryStringToUint8(binary: string): Uint8Array {
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeRegions(regions: GenomicRange[]): string {
  const json = JSON.stringify(regions);
  const compressed = pako.deflate(json); // Uint8Array
  return btoa(uint8ToBinaryString(compressed)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // URL-safe
}

export function decodeRegions(encoded: string): GenomicRange[] {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = binaryStringToUint8(binary);
  const decompressed = pako.inflate(bytes, { to: "string" });
  return JSON.parse(decompressed);
}

/**
 * 
 * @param scores Any missing are treated as -11 in logic
 * @param distanceToTSS If the cCRE overlaps a TSS, this needs to be 0 to handle edge case of large promoter (400bp+) being centered >200bp away
 * @returns 
 */
export function classifyCcre(
  scores: { dnase?: number; atac?: number; h3k4me3?: number; h3k27ac?: number; ctcf?: number },
  bindsTF: boolean,
  distanceToTSS: number,
): CcreClass {
  const dnase = scores.dnase ?? -11.0;
  const h3k4me3 = scores.h3k4me3 ?? -11.0;
  const h3k27ac = scores.h3k27ac ?? -11.0;
  const ctcf = scores.ctcf ?? -11.0;

  let ccreClass: CcreClass;
  if (dnase != -11.0) {
    if (dnase > 1.64) {
      if (h3k4me3 > 1.64) {
        if (distanceToTSS <= 200) {
          ccreClass = "PLS"; //Promoter-like signatures (promoter) must fall within 200 bp of a TSS and have high chromatin accessibility and H3K4me3 signals.
        } else if (h3k27ac <= 1.64 && distanceToTSS > 200) {
          ccreClass = "CA-H3K4me3"; //Chromatin accessibility + H3K4me3 (CA-H3K4me3) have high chromatin accessibility and H3K4me3 signals but low H3K27ac signals and do not fall within 200 bp of a TSS.
        } else if (distanceToTSS <= 2000 && h3k27ac > 1.64) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000 && h3k27ac > 1.64) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (h3k27ac > 1.64) {
        if (distanceToTSS <= 2000) {
          ccreClass = "pELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        } else if (distanceToTSS > 2000) {
          ccreClass = "dELS"; //Enhancer-like signatures (enhancer) have high chromatin accessibility and H3K27ac signals. Enhancers are further divided into TSS-proximal or distal with a 2 kb distance cutoff.
        }
      } else if (ctcf > 1.64) {
        ccreClass = "CA-CTCF"; //Chromatin accessibility + CTCF (CA-CTCF) have high chromatin accessibility and CTCF signals but low H3K4me3 and H3K27ac signals.
      } else if (bindsTF) {
        ccreClass = "CA-TF"; //Chromatin accessibility + transcription factor (CA-TF) have high chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "CA"; //Chromatin accessibility (CA) have high chromatin accessibility, and low H3K4me3, H3K27ac, and CTCF signals.
      }
    } else {
      if (bindsTF) {
        ccreClass = "TF"; //Transcription factor (TF) have low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are bound by a transcription factor.
      } else {
        ccreClass = "InActive"; //low chromatin accessibility, low H3K4me3, H3K27ac, and CTCF signals and are NOT bound by a transcription factor.
      }
    }
  } else {
    ccreClass = "noclass"; //If not active in DNase, No class assigned
  }
  return ccreClass;
};
