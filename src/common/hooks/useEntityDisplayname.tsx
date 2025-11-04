import { AnyOpenEntity } from "common/OpenEntitiesContext";
import { useGWASStudyData } from "./useGWASStudyData";
import { parseGenomicRangeString } from "common/utility";

const useEntityDisplayname = (entity: AnyOpenEntity) => {
  const { entityID, entityType } = entity;
  //Todo replace with new useGWASStudyData when the study displayname is returned
  const { data, loading, error } = useGWASStudyData({ entityType, study: [entityID] });

  let label: React.ReactNode;

  switch (entityType) {
    case "ccre":
    case "variant":
      label = entityID;
      break;
    case "gene":
      label = <i>{entityID}</i>;
      break;
    case "gwas": {
      const g = entityID.split("-");
      const study_name = g[g.length - 1].replaceAll("_", " ");
      label = study_name;
      break;
    }
    case "region": {
      const region = parseGenomicRangeString(entity.entityID);
      label = `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
    }
  }

  return { label, loading, error };
};

export default useEntityDisplayname;
