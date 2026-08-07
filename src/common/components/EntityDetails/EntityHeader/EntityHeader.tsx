import { Assembly } from "common/types/globalTypes";
import { AnyEntityType } from "common/entityTabsConfig";
import { GeneHeader } from "./GeneHeader";
import { CcreHeader } from "./CcreHeader";
import { VariantHeader } from "./VariantHeader";
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
 * Exhaustive on purpose — a new entity type should fail to compile here rather than fall through to
 * a header that knows nothing about it.
 */
export const EntityHeader = ({ assembly, entityType, entityID }: EntityHeaderProps) => {
  switch (entityType) {
    case "gene":
      return <GeneHeader assembly={assembly} entityID={entityID} />;
    case "ccre":
      return <CcreHeader assembly={assembly} entityID={entityID} />;
    case "variant":
      return <VariantHeader assembly={assembly} entityID={entityID} />;
    case "gwas":
      return <GwasStudyHeader assembly={assembly} entityID={entityID} />;
    case "region":
      return <RegionSearchHeader assembly={assembly} entityID={entityID} />;
    case "bed":
      return <BedUploadHeader fileName={entityID} />;
  }
};
