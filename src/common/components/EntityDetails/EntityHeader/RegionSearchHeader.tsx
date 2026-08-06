import { useMemo } from "react";
import { formatPortal } from "common/entityTabsConfig";
import { Assembly } from "common/types/globalTypes";
import { formatGenomicRange, parseGenomicRangeString } from "common/utils";
import { EntityHeaderLayout } from "./EntityHeaderLayout";
import { UcscBrowserButton } from "./UcscBrowserButton";

export type RegionSearchHeaderProps = {
  assembly: Assembly;
  entityID: string;
};

const RegionSearchHeader = ({ assembly, entityID }: RegionSearchHeaderProps) => {
  /**
   * The region comes straight off the route, so it can be anything. parseGenomicRangeString throws
   * on a string it can't split and returns NaN bounds for one it can't parse as numbers — neither
   * should take down the page.
   */
  const region = useMemo(() => {
    try {
      const parsed = parseGenomicRangeString(entityID);

      return Number.isNaN(parsed.start) || Number.isNaN(parsed.end) ? undefined : parsed;
    } catch {
      return undefined;
    }
  }, [entityID]);

  return (
    <EntityHeaderLayout
      label={`${formatPortal("region")} Search`}
      title={region ? formatGenomicRange(region) : entityID}
      errorMessage={region ? null : `"${entityID}" is not a valid genomic region`}
      actions={<UcscBrowserButton assembly={assembly} coordinates={region} entityType="region" />}
    />
  );
};

export default RegionSearchHeader;
