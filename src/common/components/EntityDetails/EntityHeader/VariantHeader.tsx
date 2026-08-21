import { Skeleton } from "@mui/material";
import { AsyncText } from "common/components/AsyncText";
import { formatPortal } from "common/entityTabsConfig";
import { useSnpAlleles, useSnpData } from "common/hooks/data/variant";
import { Assembly } from "common/types/globalTypes";
import { formatGenomicRange } from "common/utils";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { ExternalResourceButton } from "./ExternalResourceButton";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { headerErrorMessage } from "./headerErrorMessage";

export type VariantHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

export const VariantHeader = ({ assembly, entityID }: VariantHeaderProps) => {
  // Variants are human only, so the metadata query is always against GRCh38
  const { data: snp, loading, error } = useSnpData({ rsID: entityID, assembly: "GRCh38" });
  const alleles = useSnpAlleles([entityID]);
  const { ref, alt } = alleles.data?.[entityID] ?? {};

  return (
    <EntityHeaderLayout
      label={`${formatPortal("variant")} Details`}
      title={entityID}
      errorMessage={headerErrorMessage("variant", entityID, { loading, error, data: snp })}
      subtitle={
        loading || !snp ? (
          <Skeleton width={215} />
        ) : (
          <>
            <AsyncText loading={alleles.loading} error={alleles.error} errorMessage="Allele data unavailable">
              {/* Falsy when Ensembl has no variant for the rsID, which is not an error */}
              {ref && (
                <>
                  <strong>Reference Allele:</strong> {ref} <strong>Alternate Allele:</strong> {alt}
                </>
              )}
            </AsyncText>
            {` | ${formatGenomicRange(snp.coordinates)}`}
          </>
        )
      }
      actions={
        <>
          <ExternalResourceButton
            href={`https://www.ncbi.nlm.nih.gov/snp/${entityID}`}
            imageSrc="https://www.ncbi.nlm.nih.gov/core/assets/style-guide/img/NLM-square-logo.png"
            label="dbSNP"
          />
          <UcscBrowserButton assembly={assembly} coordinates={snp?.coordinates} entityType="variant" />
        </>
      }
    />
  );
};
