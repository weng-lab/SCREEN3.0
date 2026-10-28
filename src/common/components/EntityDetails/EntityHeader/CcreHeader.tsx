import { Skeleton } from "@mui/material";
import { CLASS_DESCRIPTIONS } from "common/ccre";
import { formatPortal } from "common/entityTabsConfig";
import { useCcre, useCcreIsIcre } from "common/hooks/data/ccre";
import { Assembly } from "common/types/globalTypes";
import { formatGenomicRange } from "common/utils";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { ExternalResourceButton } from "./ExternalResourceButton";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { headerErrorMessage } from "./headerErrorMessage";

export type CcreHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

export const CcreHeader = ({ assembly, entityID }: CcreHeaderProps) => {
  const { data: ccre, loading, error } = useCcre({ accession: entityID, assembly });
  const { data: icreMap } = useCcreIsIcre({ accessions: [entityID], assembly });
  const isIcre = icreMap?.[entityID];

  return (
    <EntityHeaderLayout
      label={`${formatPortal("ccre")} Details`}
      title={entityID}
      errorMessage={headerErrorMessage("ccre", entityID, { loading, error, data: ccre })}
      subtitle={
        loading || !ccre ? (
          <Skeleton width={215} />
        ) : (
          [CLASS_DESCRIPTIONS[ccre.group], formatGenomicRange(ccre.coordinates)].filter(Boolean).join(" | ")
        )
      }
      actions={
        <>
          {/* iCREs are human only. On human cCREs it's disabled rather than hidden, so it can't shift the layout */}
          {assembly === "GRCh38" && (
            <ExternalResourceButton
              href={isIcre ? `https://igscreen.vercel.app/icre/${entityID}` : undefined}
              imageSrc="/igSCREEN_logo.svg"
              label="igSCREEN"
              disabledReason={isIcre === false ? "Not an immune cCRE (iCRE)" : undefined}
            />
          )}
          <UcscBrowserButton assembly={assembly} coordinates={ccre?.coordinates} entityType="ccre" />
        </>
      }
    />
  );
};
