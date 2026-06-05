import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatGenomicRange, formatPortal } from "common/utility";
import { CLASS_DESCRIPTIONS } from "common/consts";
import { Assembly } from "common/types/globalTypes";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { useGeneDescription } from "common/hooks/useGeneDescription";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { AnyEntityType } from "../../entityTabsConfig";
import { expandCoordinates } from "../GenomeBrowser/utils";
export type EntityDetailsHeaderProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
};

export const EntityDetailsHeader = ({ assembly, entityType, entityID }: EntityDetailsHeaderProps) => {
  const { data: entityMetadata, loading, error: _ } = useEntityMetadata({ assembly, entityType, entityID });
  const assemblyDb = assembly === "mm10" ? "mm10" : "hg38";
  const ucscTrack = assembly === "mm10" ? "encodeCcreCombined" : "cCREs";
  const c =
    entityMetadata?.__typename !== "GwasStudiesMetadata" &&
    entityMetadata?.__typename !== "Bed" &&
    entityMetadata?.coordinates;
  const coordinatesDisplay = c && formatGenomicRange(c);
  const coordinatesGenomeBrowser = c && formatGenomicRange(expandCoordinates(c, entityType))
  const description = useGeneDescription(entityID, entityType).description;
  const SnpAlleleFrequencies = useSnpFrequencies([entityID], entityType);

  //All data used in the subtitle of the element header based on the element type
  const geneID = entityMetadata?.__typename === "Gene" ? entityMetadata?.id : "";
  const strand = entityMetadata?.__typename === "Gene" ? entityMetadata.strand : "";
  const ccreClass = entityMetadata?.__typename === "CCRE" ? entityMetadata?.group : "";
  const ref =
    entityMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[entityID]?.ref : "";
  const alt =
    entityMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[entityID]?.alt : "";

  /**
   * @todo this should be put in a utils file
   */
  //map descriptions to the class
  const subtitle =
    entityType === "gene" ? (
      geneID + " | " + (strand === "+" ? "+ strand" : "- strand")
    ) : entityType === "ccre" ? (
      <>{CLASS_DESCRIPTIONS[ccreClass] ?? ""}</>
    ) : entityType === "variant" ? (
      !ref ? (
        <Skeleton width={215} />
      ) : (
        <>
          <strong>Reference Allele:</strong> {ref} <strong>Alternate Allele:</strong> {alt}
        </>
      )
    ) : (
      ""
    );

  /**
   * @todo this layout is too complicated, simplify
   */

  return (
    <Grid
      sx={{ p: 1 }}
      border={(theme) => `1px solid ${theme.palette.divider}`}
      borderRadius={1}
      direction={"row"}
      justifyContent={"space-between"}
      container
    >
      <Grid size={{ xs: 12, sm: 9 }}>
        <Stack>
          <Typography variant="subtitle1">{formatPortal(entityType)} Details</Typography>
          <Typography variant="h4">
            {entityType === "gene" ? <i>{entityID}</i> : entityID}
            {/* Loading skeleton for gene description */}
            {loading && entityType === "gene" ? (
              <Skeleton width={215} sx={{ display: "inline-block", ml: 2 }} />
            ) : entityType === "gene" && description !== null ? (
              ` (${description})`
            ) : (
              ""
            )}
          </Typography>
          <Typography>
            {loading ? <Skeleton width={215} /> : <>{subtitle}{coordinatesDisplay ? ` | ${coordinatesDisplay}` : ""}</>}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: "auto" }} display={"flex"} justifyContent={{xs: "flex-start", sm: "flex-end"}} alignItems={"flex-start"} gap={1}>
        {entityType !== "ccre" && (
          <Button
            variant="outlined"
            href={
              entityID
                ? entityType === "gene"
                  ? "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + entityID
                  : `https://www.ncbi.nlm.nih.gov/snp/${entityID}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              width: 125,
              height: 60,
              minWidth: 0,
              position: "relative",
              backgroundColor: "transparent",
              borderColor: "divider",
              "& img": { transition: "filter 0.2s ease" },
              "&:hover img": { filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" },
            }}
          >
            <Image
              style={{ objectFit: "contain" }}
              src={
                entityType === "gene"
                  ? "https://geneanalytics.genecards.org/media/81632/gc.png"
                  : "https://www.ncbi.nlm.nih.gov/core/assets/style-guide/img/NLM-square-logo.png"
              }
              fill
              alt="genecard-snpcard-button"
            />
          </Button>
        )}
        <Button
          variant="outlined"
          href={
            coordinatesGenomeBrowser
              ? `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=${assemblyDb}&g=${ucscTrack}&position=${coordinatesGenomeBrowser}`
              : `https://genome.ucsc.edu/cgi-bin/hgTrackUi?db=${assemblyDb}&g=${ucscTrack}&position=default`
          }
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: 125,
            height: 60,
            minWidth: 0,
            position: "relative",
            backgroundColor: "transparent",
            borderColor: "divider",
            "& img": { transition: "filter 0.2s ease" },
            "&:hover img": { filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" },
          }}
        >
          <Image
            style={{ objectFit: "contain" }}
            src={"https://genome.ucsc.edu/images/ucscHelixLogo.png"}
            fill
            unoptimized
            alt="ucsc-gb-icon"
          />
        </Button>
      </Grid>
    </Grid>
  );
};
