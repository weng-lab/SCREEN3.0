import { Skeleton } from "@mui/material";
import { useEntityMetadata } from "common/hooks/data/entity";
import { formatPortal } from "common/entityTabsConfig";
import { Assembly, GenomicRange } from "common/types/globalTypes";
import { LinkComponent } from "common/components/LinkComponent";
import { useMemo } from "react";
import { useGWASSnpsData } from "common/hooks/data/gwas";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";

export type GwasStudyHeaderProps = {
  assembly: Assembly;
  entityType: "gwas";
  entityID: string;
};

export const GwasStudyHeader = ({ assembly, entityType, entityID }: GwasStudyHeaderProps) => {
  const {
    data: study,
    loading: studyLoading,
    error: studyError,
  } = useEntityMetadata({ assembly, entityType, entityID });
  /**
   * Only the coordinates of the first LD block are needed here, so loading/error are not
   * destructured — the UCSC button is disabled whenever the coordinates are unavailable, for any
   * reason. The GWAS browser tab surfaces fetch failures of this query.
   */
  const { data: snps } = useGWASSnpsData({ studyid: [entityID] });

  /** Span of the lowest-numbered LD block in the study, which is where the UCSC link points */
  const firstLdBlock = useMemo(() => {
    let span: (GenomicRange & { ldblock: number }) | undefined;

    for (const { ldblock, chromosome, start, stop } of snps ?? []) {
      if (!span || ldblock < span.ldblock) {
        span = { ldblock, chromosome, start, end: stop };
      } else if (ldblock === span.ldblock) {
        span.start = Math.min(span.start, start);
        span.end = Math.max(span.end, stop);
      }
    }

    return span;
  }, [snps]);

  const pubmedID = study?.studyid.split("-")[0].trim();

  const errorMessage = studyError
    ? "Error fetching study details"
    : !studyLoading && !study
      ? `No GWAS study found with ID ${entityID}`
      : null;

  return (
    <EntityHeaderLayout
      label={`${formatPortal(entityType)} Details`}
      // Falls back to the study ID so the header still identifies the entity when the fetch fails
      title={studyLoading ? <Skeleton width={"60%"} /> : (study?.disease_trait ?? entityID)}
      errorMessage={errorMessage}
      subtitle={
        studyLoading || !study ? (
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
      actions={<UcscBrowserButton assembly={assembly} coordinates={firstLdBlock} entityType={entityType} />}
    />
  );
};
