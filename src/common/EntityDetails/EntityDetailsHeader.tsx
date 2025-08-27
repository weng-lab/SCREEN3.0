import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEntityMetadata } from "common/hooks/useEntityMetadata";
import { formatPortal } from "common/utility";
import { Assembly, EntityType } from "types/globalTypes";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { useGeneDescription } from "common/hooks/useGeneDescription";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";

export type EntityDetailsHeaderProps<A extends Assembly> = {
  assembly: A;
  entityType: EntityType<A>;
  entityID: string;
};

export const EntityDetailsHeader = <A extends Assembly>({ assembly, entityType, entityID }: EntityDetailsHeaderProps<A>) => {
  const { data: entityMetadata, loading, error } = useEntityMetadata({ assembly, entityType, entityID });

  const c = entityMetadata?.__typename === "SCREENSearchResult" ? {chromosome: entityMetadata?.chrom, start: entityMetadata?.start, end: entityMetadata?.start + entityMetadata?.len } : entityMetadata?.coordinates;
  const coordinatesDisplay = c && `${c.chromosome}:${c.start.toLocaleString()}-${c.end.toLocaleString()}`;

  const description = useGeneDescription(entityID, entityType).description;
  const SnpAlleleFrequencies = useSnpFrequencies([entityID], entityType);

  //All data used in the subtitle of the element header based on the element type
  const geneID = entityMetadata?.__typename === "Gene" ? entityMetadata?.id : "";
  const ccreClass = entityMetadata?.__typename === "SCREENSearchResult" ? entityMetadata?.pct : "";
  const ref =
    entityMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[entityID]?.ref : "";
  const alt =
    entityMetadata?.__typename === "SNP" && SnpAlleleFrequencies.data ? SnpAlleleFrequencies.data[entityID]?.alt : "";

/**
 * @todo this should be put in a utils file
 */
  //map descriptions to the class
  const ccreClassDescriptions: Record<string, string> = {
    PLS: "(Promoter-like Signature)",
    pELS: "(Proximal Enhancer)",
    dELS: "(Distal Enhancer)",
    "CA-H3K4me3": "(Chromatin Accessibility + H3K4me3)",
    "CA-CTCF": "(Chromatin Accessibility + CTCF)",
    "CA-TF": "(Chromatin Accessibility + Transcription Factor)",
    CA: "(Chromatin Accessibility)",
    TF: "(Transcription Factor)",
  };

  const subtitle =
    entityType === "gene" ? (
      geneID
    ) : entityType === "ccre" ? (
      <>
        {ccreClass} {ccreClassDescriptions[ccreClass] ?? ""}
      </>
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
          <Typography>{loading ? <Skeleton width={215} /> : subtitle}</Typography>
        </Stack>
      </Grid>
      {
        /**
         * @todo this layout is too complicated, simplify
         */
      }
      <Grid size={{ xs: 12, sm: 3 }}>
        <Grid container direction="column" spacing={1} sx={{ height: "100%" }} textAlign={"right"}>
          <Grid container spacing={1} sx={{ flexGrow: 1 }} order={{ xs: 2, sm: 1 }} justifyContent={"flex-end"}>
            <Grid size={12} display={entityType === "ccre" ? "none" : "flex"} height={{ xs: 65, sm: "auto" }}>
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
          <Grid display={"flex"} justifyContent={{ xs: "flex-starrt", sm: "flex-end" }} order={{ xs: 1, sm: 2 }}>
            <Typography>{loading ? <Skeleton width={215} /> : coordinatesDisplay}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};