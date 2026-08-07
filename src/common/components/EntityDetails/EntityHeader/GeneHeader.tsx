import { Skeleton } from "@mui/material";
import { AsyncText } from "common/components/AsyncText";
import { formatPortal } from "common/entityTabsConfig";
import { useGeneData, useGeneDescription } from "common/hooks/data/gene";
import { Assembly } from "common/types/globalTypes";
import { formatGenomicRange } from "common/utils";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { ExternalResourceButton } from "./ExternalResourceButton";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { headerErrorMessage } from "./headerErrorMessage";

export type GeneHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

export const GeneHeader = ({ assembly, entityID }: GeneHeaderProps) => {
  const { data: gene, loading, error } = useGeneData({ name: entityID, assembly });
  const description = useGeneDescription(entityID);

  return (
    <EntityHeaderLayout
      label={`${formatPortal("gene")} Details`}
      title={
        <>
          <i>{entityID}</i>
          <AsyncText
            loading={description.loading}
            error={description.error}
            errorMessage=" (description unavailable)"
            sx={{ ml: 2 }}
          >
            {/* Null when NCBI has no entry for the gene, which is not an error */}
            {description.description !== null ? ` (${description.description})` : ""}
          </AsyncText>
        </>
      }
      errorMessage={headerErrorMessage("gene", entityID, { loading, error, data: gene })}
      subtitle={
        loading || !gene ? (
          <Skeleton width={215} />
        ) : (
          [gene.id, gene.strand === "+" ? "+ strand" : "- strand", formatGenomicRange(gene.coordinates)]
            .filter(Boolean)
            .join(" | ")
        )
      }
      actions={
        <>
          <ExternalResourceButton
            href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${entityID}`}
            imageSrc="https://geneanalytics.genecards.org/media/81632/gc.png"
            label="GeneCards"
          />
          <UcscBrowserButton assembly={assembly} coordinates={gene?.coordinates} entityType="gene" />
        </>
      }
    />
  );
};
