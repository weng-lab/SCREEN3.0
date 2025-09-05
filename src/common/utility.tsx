import { Assembly, GenomicRange } from "types/globalTypes";
import { cellCategoryColors, cellCategoryDisplaynames, studyLinks } from "./consts";
import { Typography, TypographyOwnProps, Link, LinkProps } from "@mui/material";
import { AnyOpenEntity } from "./EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { Launch } from "@mui/icons-material";
import { AnyTabRoute, AnyEntityType, EntityRoute, EntityType, validEntityTypes, entityTabsConfig } from "./EntityDetails/entityTabsConfig";

export function getClassDisplayname(input: string) {
  switch (input) {
    case "PLS":
      return "Promoter";
    case "pELS":
      return "Proximal Enhancer";
    case "dELS":
      return "Distal Enhancer";
    case "CA-H3K4me3":
      return "Chromatin Accessible with H3K4me3";
    case "CA-TF":
      return "Chromatin Accessible with TF";
    case "CA-CTCF":
      return "Chromatin Accessible with CTCF";
    case "CA":
      return "Chromatin Accessible";
    case "TF":
      return "Transcription Factor";
    case "InActive":
      return "Inactive";
    default:
      return "No Class Found";
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 * @param props 
 * @returns 
 */
export const CreateLink: React.FC<{ 
  linkPrefix: string,
   linkArg?: string, 
   label: string, 
   showExternalIcon?: boolean,
   onClick?: React.MouseEventHandler<HTMLAnchorElement>
    variant?: LinkProps["variant"], textColor?: string, underline?: "none" | "always" | "hover" }> = (props) => {
  const link = props.linkPrefix + (props.linkArg ?? "")
  return (
    <Link variant={props.variant} href={link} rel="noopener noreferrer" target="_blank" color={props.textColor} underline={props.underline} onClick={props.onClick}>
      {props.label}
      {props.showExternalIcon && <Launch sx={{ display: "inline-flex", verticalAlign: "middle", ml: 0.5 }} color="inherit" fontSize="inherit" />}
    </Link>
  )
}

/**
 * Very dumb parser for genomic range. No input checking. Assumes proper formatting and no commas in values.
 * Will handle URL encoding of ':' as '%3A'
 * @param input `String` with format chr:start-end
 * @returns `GenomicRange`
 */
export function parseGenomicRangeString(input: string): GenomicRange {
  if (input.includes("%3A")) {
    return {
      // %3A is URL encoding of ":"
      chromosome: input.split("%3A")[0],
      start: +input.split("%3A")[1].split("-")[0],
      end: +input.split("%3A")[1].split("-")[1],
    };
  } else
    return {
      chromosome: input.split(":")[0],
      start: +input.split(":")[1].split("-")[0],
      end: +input.split(":")[1].split("-")[1],
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
    default:
      return null;
  }
}

/**
 *
 * @param cell use ```lineage``` field of return data
 * @returns the corresponding color for that cell category, or black if not found
 */
export function getCellCategoryColor(cell: string): string {
  return cellCategoryColors[cell] || "#000000";
}

/**
 *
 * @param cell use ```lineage``` field of return data
 * @returns the corresponding celltype display name for the category, or "Unknown Celltype if not found"
 */
export function getCellCategoryDisplayname(cell: string) {
  return cellCategoryDisplaynames[cell] || "Unknown Celltype";
}

/**
 *
 * @param study use ```study``` field of return data
 * @returns The corresponding DOI link for the study, or "Unknown Study" if not found
 */
export function getStudyLink(study: string) {
  return studyLinks[study] || "Unknown Study";
}

/**
 * Only use this function if use case is unable to handle jsx element and needs string. Use `toScientificNotationElement` if possible
 */
export function toScientificNotation(num: number, sigFigs?: number) {
  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs ?? undefined);

  // Split the scientific notation into the coefficient and exponent parts
  let [coefficient, exponent] = scientific.split("e");

  // Format the exponent part
  let expSign = exponent[0];
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
 * @param variant MUI Typography Variant to be used
 * @param sigFigs Number of desired significant figures
 * @returns
 */
export function toScientificNotationElement(num: number, sigFigs: number, typographyProps?: TypographyOwnProps) {
  if (num > 0.01) {
    return <Typography {...typographyProps}>{num.toFixed(2)}</Typography>;
  }

  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs);
  let [coefficient, exponent] = scientific.split("e");

  return (
    <Typography {...typographyProps}>
      {coefficient}&nbsp;×&nbsp;10<sup>{exponent}</sup>
    </Typography>
  );
}

const svgData = (_svg): string => {
  let svg = _svg.cloneNode(true);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  let preface = '<?xml version="1.0" standalone="no"?>';
  return preface + svg.outerHTML.replace(/\n/g, "").replace(/[ ]{8}/g, "");
};

const downloadData = (text: string, filename: string, type: string = "text/plain") => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.setAttribute("style", "display: none");
  const blob = new Blob([text], { type });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};

export const downloadSVG = (ref: React.MutableRefObject<SVGSVGElement>, filename: string) => {
  ref.current && downloadData(svgData(ref.current!), filename, "image/svg;charset=utf-8");
};

/**
 *
 * @param region {chrom, start, end}
 * @param transcripts
 * @returns distance to nearest TSS from the center of cCRE body.
 */
export function calcDistCcreToTSS(
  region: GenomicRange,
  transcripts: { id: string; coordinates: GenomicRange }[],
  strand: "+" | "-"
): number {
  const distances: number[] = transcripts.map((transcript) =>
    calcDistRegionToPosition(
      region.start,
      region.end,
      "middle",
      strand === "+" ? transcript.coordinates.start : transcript.coordinates.end
    )
  );
  return Math.min(...distances);
}


export function ccreOverlapsTSS(
  region: GenomicRange,
  transcripts: { id: string; coordinates: GenomicRange }[],
  strand: "+" | "-"
): boolean {
  const distances: number[] = transcripts.map((transcript) => {
    const tss = strand === "+" ? transcript.coordinates.start : transcript.coordinates.end
    return calcDistRegionToRegion(region, {start: tss, end: tss})
  })
  
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

const openEntityListDelimiter = ','
const openEntityDelimiter = '/'

/**
 *
 * @param urlOpen properly formatted URI Encoded query parameter representing ```OpenEntity[]``` state
 * @returns ```OpenEntity[]```
 */
export function decompressOpenEntitiesFromURL(urlOpenEntities: string | null): AnyOpenEntity[] {
  return decompressFromEncodedURIComponent(urlOpenEntities)
    .split(openEntityListDelimiter)
    .map((entry) => {
      const [encodedAssembly, encodedEntityType, entityID, encodedTab = ""] = entry.split(openEntityDelimiter);
      return {
        entityType: decodeEntityType(encodedEntityType),
        entityID,
        tab: decodeTabRoute(encodedTab),
        assembly: assemblyDecoding[encodedAssembly],
      };
    })
    .filter((x) => x.entityType && x.entityID); // filter out any invalid
}

/**
 *
 * @param openEntities
 * @returns URI encoded query parameter representing the ```OpenEntity[]``` state
 */
export function compressOpenEntitiesToURL(openEntities: AnyOpenEntity[]): string {
  return compressToEncodedURIComponent(
    openEntities
      .map((x) => [assemblyEncoding[x.assembly], encodeEntityType(x.entityType), x.entityID,  encodeTabRoute(x.tab)].join(openEntityDelimiter))
      .join(openEntityListDelimiter)
  );
}

const encodeEntityType = (entity: AnyEntityType): string => {
  const allEntityTypes = [...new Set(Object.values(validEntityTypes).flat())]
  return String(allEntityTypes.indexOf(entity))
}

const decodeEntityType = (key: string): AnyEntityType => {
  const allEntityTypes = [...new Set(Object.values(validEntityTypes).flat())]
  return allEntityTypes[+key]
}

const encodeTabRoute = (tab: AnyTabRoute): string => {
  const allTabRoutes: AnyTabRoute[] = Object.values(entityTabsConfig).map(assemblyConfig => Object.values(assemblyConfig)).flat(2).map(x => x.route)
  return String(allTabRoutes.indexOf(tab))
}

const decodeTabRoute = (key: string): AnyTabRoute => {
  const allTabRoutes: AnyTabRoute[] = Object.values(entityTabsConfig).map(assemblyConfig => Object.values(assemblyConfig)).flat(2).map(x => x.route)
  return allTabRoutes[+key]
}

const assemblyEncoding: {[key in Assembly]: string} = {
  'GRCh38': 'h',
  'mm10': 'm'
}

const assemblyDecoding: {[key: string]: Assembly} = Object.fromEntries(
  Object.entries(assemblyEncoding).map(([entity, encoding]: [Assembly, string]) => [encoding, entity])
);
