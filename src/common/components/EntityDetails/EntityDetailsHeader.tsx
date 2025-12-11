import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatGenomicRange, formatPortal } from "common/utility";
import { ccreClassDescriptions } from "common/consts";
import { Assembly } from "common/types/globalTypes";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { useGeneDescription } from "common/hooks/useGeneDescription";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";
import { AnyEntityType } from "../../entityTabsConfig";

export type EntityDetailsHeaderProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
};

export const EntityDetailsHeader = ({ assembly, entityType, entityID }: EntityDetailsHeaderProps) => {
  const { data: entityMetadata, loading, error: _ } = useEntityMetadata({ assembly, entityType, entityID });
  const c =
    entityMetadata?.__typename !== "GwasStudiesMetadata" &&
    (entityMetadata?.__typename === "SCREENSearchResult"
      ? {
          chromosome: entityMetadata?.chrom,
          start: entityMetadata?.start,
          end: entityMetadata?.start + entityMetadata?.len,
        }
      : entityMetadata?.coordinates);
  const coordinatesDisplay = c && formatGenomicRange(c);

  const description = useGeneDescription(entityID, entityType).description;
  const SnpAlleleFrequencies = useSnpFrequencies([entityID], entityType);

  //All data used in the subtitle of the element header based on the element type
  const geneID = entityMetadata?.__typename === "Gene" ? entityMetadata?.id : "";
  const strand = entityMetadata?.__typename === "Gene" ? entityMetadata.strand : "";
  const ccreClass = entityMetadata?.__typename === "SCREENSearchResult" ? entityMetadata?.pct : "";
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
      geneID + " | " + (strand === "+" ? "Plus strand" : "Minus strand")
    ) : entityType === "ccre" ? (
      <>{ccreClassDescriptions[ccreClass] ?? ""}</>
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
            <Typography>{loading ? <Skeleton width={215} /> : coordinatesDisplay}</Typography>
          </Typography>
          <Typography>{loading ? <Skeleton width={215} /> : subtitle}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }} display={entityType === "ccre" ? "none" : "flex"} height={{ xs: 65 }}>
        <Button
          variant="contained"
          href={
            entityID
              ? entityType === "gene"
                ? "https://www.genecards.org/cgi-bin/carddisp.pl?gene=" + entityID
                : `https://www.ncbi.nlm.nih.gov/snp/${entityID}`
              : undefined
          }
          target="_blank"
          rel="noopener noreferrer"
          sx={{ width: "100%", height: "100%", backgroundColor: "white" }}
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
      </Grid>
    </Grid>
  );
};
