import { Skeleton } from "@mui/material";
import { CLASS_DESCRIPTIONS } from "common/ccre";
import { formatPortal } from "common/entityTabsConfig";
import { useCcre } from "common/hooks/data/ccre";
import { Assembly } from "common/types/globalTypes";
import { formatGenomicRange } from "common/utils";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";
import { headerErrorMessage } from "./headerErrorMessage";

export type CcreHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

export const CcreHeader = ({ assembly, entityID }: CcreHeaderProps) => {
  const { data: ccre, loading, error } = useCcre({ accession: entityID, assembly });

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
      actions={<UcscBrowserButton assembly={assembly} coordinates={ccre?.coordinates} entityType="ccre" />}
    />
  );
};
