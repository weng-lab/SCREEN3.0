import { useGWASStudyData } from "./useGWASStudyData";
import { parseGenomicRangeString } from "common/utility";
import { AnyEntityType } from "common/entityTabsConfig";

type useEntityDisplaynameProps = {
  entityID: string;
  entityType: AnyEntityType;
};

const useEntityDisplayname = ({ entityID, entityType }: useEntityDisplaynameProps) => {
  const { data, loading, error } = useGWASStudyData({ entityType, studyid: [entityID] });

  let label: React.ReactNode;

  switch (entityType) {
    case "ccre":
    case "bed":
    case "variant":
      label = entityID;
      break;
    case "gene":
      label = <i>{entityID}</i>;
      break;
    case "gwas": {
      const g = entityID.split("-");
      const study_name = g[g.length - 1].replaceAll("_", " ");
      label = data?.disease_trait || study_name;
      break;
    }
    case "region": {
      const region = parseGenomicRangeString(entityID);
      label = `${region.chromosome}:${region.start.toLocaleString()}-${region.end.toLocaleString()}`;
    }
  }

  return { label, loading, error };
};

export default useEntityDisplayname;
