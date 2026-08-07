import { Skeleton } from "@mui/material";
import { LinkComponent } from "common/components/LinkComponent";
import { formatPortal } from "common/entityTabsConfig";
import { useEntityMetadata } from "common/hooks/data/entity";
import { useGWASSnpsData, useLdBlocks } from "common/hooks/data/gwas";
import { Assembly } from "common/types/globalTypes";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { headerErrorMessage } from "./headerErrorMessage";

export type GwasStudyHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

export const GwasStudyHeader = ({ assembly, entityID }: GwasStudyHeaderProps) => {
  const { data: study, loading, error } = useEntityMetadata({ assembly, entityType: "gwas", entityID });
  /**
   * Only the coordinates of the first LD block are needed here, so loading/error are not
   * destructured — the UCSC button is disabled whenever the coordinates are unavailable, for any
   * reason. The GWAS browser tab surfaces fetch failures of this query.
   */
  const { data: snps } = useGWASSnpsData({ studyid: [entityID] });
  const [firstLdBlock] = useLdBlocks(snps);

  const pubmedID = study?.studyid.split("-")[0].trim();

  return (
    <EntityHeaderLayout
      label={`${formatPortal("gwas")} Details`}
      // Falls back to the study ID so the header still identifies the entity when the fetch fails
      title={loading ? <Skeleton width={"60%"} /> : (study?.disease_trait ?? entityID)}
      errorMessage={headerErrorMessage("gwas", entityID, { loading, error, data: study })}
      subtitle={
        loading || !study ? (
          <Skeleton width={215} />
        ) : (
          <>
            {study.author.replaceAll("_", " ")}{" "}
            <LinkComponent openInNewTab showExternalIcon href={`https://pubmed.ncbi.nlm.nih.gov/${pubmedID}`}>
              ({pubmedID})
            </LinkComponent>
          </>
        )
      }
      actions={<UcscBrowserButton assembly={assembly} coordinates={firstLdBlock} entityType="gwas" />}
    />
  );
};
