import { Skeleton } from "@mui/material";
import { useEntityMetadata } from "common/hooks/data/entity";
import { formatGenomicRange } from "common/utils";
import { formatPortal } from "common/entityTabsConfig";
import { CLASS_DESCRIPTIONS } from "common/ccre";
import { Assembly } from "common/types/globalTypes";
import { useGeneDescription } from "common/hooks/data/gene";
import { useSnpAlleles } from "common/hooks/data/variant";
import { AnyEntityType } from "common/entityTabsConfig";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { ExternalResourceButton } from "./ExternalResourceButton";
import { AsyncText } from "common/components/AsyncText";

export type EntityDetailsHeaderProps = {
  assembly: Assembly;
  /** The entity types not claimed by a more specific header, matching EntityDetailsLayout's default case */
  entityType: Exclude<AnyEntityType, "region" | "gwas" | "bed">;
  entityID: string;
};

export const EntityDetailsHeader = ({ assembly, entityType, entityID }: EntityDetailsHeaderProps) => {
  const { data: entityMetadata, loading, error } = useEntityMetadata({ assembly, entityType, entityID });
  const coordinates = entityMetadata?.coordinates;
  const coordinatesDisplay = coordinates && formatGenomicRange(coordinates);
  const geneDescription = useGeneDescription(entityID, { skip: entityType !== "gene" });
  const snpAlleles = useSnpAlleles([entityID], { skip: entityType !== "variant" });

  const errorMessage = error
    ? `Error fetching ${formatPortal(entityType)} details`
    : !loading && !entityMetadata
      ? `No ${formatPortal(entityType)} found with ID ${entityID}`
      : null;

  //All data used in the subtitle of the element header based on the element type
  const geneID = entityMetadata?.__typename === "Gene" ? entityMetadata?.id : "";
  const strand = entityMetadata?.__typename === "Gene" ? entityMetadata.strand : "";
  const ccreClass = entityMetadata?.__typename === "CCRE" ? entityMetadata?.group : "";
  const ref = entityMetadata?.__typename === "SNP" && snpAlleles.data ? snpAlleles.data[entityID]?.ref : "";
  const alt = entityMetadata?.__typename === "SNP" && snpAlleles.data ? snpAlleles.data[entityID]?.alt : "";

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
      <AsyncText loading={snpAlleles.loading} error={snpAlleles.error} errorMessage="Allele data unavailable">
        {/* Falsy when Ensembl has no variant for the rsID, which is not an error */}
        {ref && (
          <>
            <strong>Reference Allele:</strong> {ref} <strong>Alternate Allele:</strong> {alt}
          </>
        )}
      </AsyncText>
    ) : (
      ""
    );

  return (
    <EntityHeaderLayout
      label={`${formatPortal(entityType)} Details`}
      title={
        <>
          {entityType === "gene" ? <i>{entityID}</i> : entityID}
          {entityType === "gene" && (
            <AsyncText
              loading={geneDescription.loading}
              error={geneDescription.error}
              errorMessage=" (description unavailable)"
              sx={{ ml: 2 }}
            >
              {/* Null when NCBI has no entry for the gene, which is not an error */}
              {geneDescription.description !== null ? ` (${geneDescription.description})` : ""}
            </AsyncText>
          )}
        </>
      }
      errorMessage={errorMessage}
      subtitle={
        loading ? (
          <Skeleton width={215} />
        ) : (
          <>
            {subtitle}
            {coordinatesDisplay ? ` | ${coordinatesDisplay}` : ""}
          </>
        )
      }
      actions={
        <>
          {entityType !== "ccre" && (
            <ExternalResourceButton
              href={
                entityType === "gene"
                  ? `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${entityID}`
                  : `https://www.ncbi.nlm.nih.gov/snp/${entityID}`
              }
              imageSrc={
                entityType === "gene"
                  ? "https://geneanalytics.genecards.org/media/81632/gc.png"
                  : "https://www.ncbi.nlm.nih.gov/core/assets/style-guide/img/NLM-square-logo.png"
              }
              label={entityType === "gene" ? "GeneCards" : "dbSNP"}
            />
          )}
          <UcscBrowserButton assembly={assembly} coordinates={coordinates} entityType={entityType} />
        </>
      }
    />
  );
};
