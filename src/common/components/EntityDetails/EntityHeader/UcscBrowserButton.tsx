import { AnyEntityType } from "common/entityTabsConfig";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { formatGenomicRange } from "common/utils";
import { expandCoordinates } from "common/components/GenomeBrowser/utils";
import { ExternalResourceButton } from "./ExternalResourceButton";

export type UcscBrowserButtonProps = {
  assembly: Assembly;
  /**
   * Unpadded region — this component owns the call to expandCoordinates. Undefined (not yet
   * fetched, or the fetch failed) disables the button rather than linking to an arbitrary locus.
   */
  coordinates: GenomicRange | undefined;
  /** Determines how much padding is added around the coordinates */
  entityType: AnyEntityType;
};

/**
 * Links out to the region in the UCSC Genome Browser. Shared by every entity header — keep it
 * presentational so each header stays the owner of how its coordinates are derived.
 */
export const UcscBrowserButton = ({ assembly, coordinates, entityType }: UcscBrowserButtonProps) => {
  const assemblyDb = assembly === "mm10" ? "mm10" : "hg38";
  const ucscTrack = assembly === "mm10" ? "encodeCcreCombined" : "cCREs";
  const position = coordinates && formatGenomicRange(expandCoordinates(coordinates, entityType));

  return (
    <ExternalResourceButton
      href={
        position
          ? `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=${assemblyDb}&g=${ucscTrack}&position=${position}`
          : undefined
      }
      imageSrc="https://genome.ucsc.edu/images/ucscHelixLogo.png"
      label="UCSC Genome Browser"
      unoptimized
    />
  );
};
