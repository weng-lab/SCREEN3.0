import { AnyEntityType } from "common/entityTabsConfig";
import { Assembly } from "common/types/globalTypes";
import { AnyOpenEntity, OpenEntityAction, OpenEntityState } from "./types";

export const openEntitiesReducer = (openEntities: OpenEntityState, action: OpenEntityAction) => {
  let newState: OpenEntityState;
  switch (action.type) {
    //Add Entity to the end of the part of the array containing the assembly, if none exist add to the end
    case "addEntity": {
      if (openEntities.some((el) => el.entityID === action.entity.entityID && el.assembly === action.entity.assembly)) {
        newState = openEntities;
      } else {
        newState = [...openEntities, action.entity];
      }
      break;
    }
    case "removeEntity": {
      if (openEntities.length > 1) {
        newState = openEntities.filter(
          (el) =>
            el.entityID !== action.entity.entityID ||
            el.entityType !== action.entity.entityType ||
            el.assembly !== action.entity.assembly
        );
      } else newState = openEntities;
      break;
    }
    case "updateEntity": {
      newState = openEntities.map((el) =>
        el.entityID === action.entity.entityID && el.assembly === action.entity.assembly ? action.entity : el
      );
      break;
    }
    case "reorder": {
      const newOpenEntities = [...openEntities];
      const [removed] = newOpenEntities.splice(action.startIndex, 1);
      newOpenEntities.splice(action.endIndex, 0, removed);
      newState = newOpenEntities;
      break;
    }
    case "sort": {
      const assemblyOrder: Assembly[] = ["GRCh38", "mm10"];
      const entityOrder: AnyEntityType[] = ["region", "gene", "ccre", "variant", "gwas", "bed"];

      const sortFn = (a: AnyOpenEntity, b: AnyOpenEntity) => {
        const assemblyComparison = assemblyOrder.indexOf(a.assembly) - assemblyOrder.indexOf(b.assembly);
        if (assemblyComparison !== 0) return assemblyComparison;

        const entityComparison = entityOrder.indexOf(a.entityType) - entityOrder.indexOf(b.entityType);
        if (entityComparison !== 0) return entityComparison;

        return a.entityID.localeCompare(b.entityID);
      };

      const newOpenEntities = [...openEntities];
      newOpenEntities.sort(sortFn);

      newState = newOpenEntities;
      break;
    }
    case "setState": {
      newState = action.state;
      break;
    }
  }
  return newState;
};
