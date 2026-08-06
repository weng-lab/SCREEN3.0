import { parseGenomicRangeString } from "common/utils";
import { Assembly } from "common/types/globalTypes";
import { AnyEntityType } from "common/entityTabsConfig";
import { EntityDetailsHeader } from "./EntityDetailsHeader";
import { GwasStudyHeader } from "./GwasStudyHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import BedUploadHeader from "./BedUploadHeader";

export type EntityHeaderProps = {
  assembly: Assembly;
  entityType: AnyEntityType;
  entityID: string;
};

/**
 * Picks the header for an entity type. Each one fetches whatever it needs to describe its entity
 * and composes EntityHeaderLayout, so they all present the same chrome.
 *
 * Entity types with nothing specific to fetch or display fall through to EntityDetailsHeader.
 */
export const EntityHeader = ({ assembly, entityType, entityID }: EntityHeaderProps) => {
  switch (entityType) {
    case "region":
      return <RegionSearchHeader assembly={assembly} region={parseGenomicRangeString(entityID)} />;
    case "gwas":
      return <GwasStudyHeader assembly={assembly} entityType={entityType} entityID={entityID} />;
    case "bed":
      return <BedUploadHeader fileName={entityID} />;
    default:
      return <EntityDetailsHeader assembly={assembly} entityType={entityType} entityID={entityID} />;
  }
};
