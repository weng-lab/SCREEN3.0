import { isValidAssembly } from "common/types/globalTypes";
import { getComponentForEntity, isValidEntityType, isValidRouteForEntity } from "common/entityTabsConfig";
import { use } from "react";
import { CandidateOpenEntity, isValidOpenEntity } from "common/OpenEntitiesContext";

export default function DetailsPage({
  params,
}: {
  params: Promise<{ assembly: string; entityType: string; entityID: string; tab: string }>;
}) {
  const { assembly, entityType, entityID, tab: tabString } = use(params);

  if (!isValidAssembly(assembly)) {
    throw new Error(`Unknown assembly: ${assembly}`);
  }

  if (!isValidEntityType(assembly, entityType)) {
    throw new Error(`Unknown entity for ${assembly}: ${entityType}`);
  }

  let tab = tabString;

  /**
   * Since [[...tab]] is an optional catch-all route, tabs is an array.
   * tab is undefined when hitting /entityType/entityID (default tab's route).
   * "" is defined as valid shared route in the type SharedRoute, so change undefined to ""
   */
  if (tab === undefined) {
    tab = "";
  } else {
    tab = tab[0];
  }

  if (!isValidRouteForEntity(assembly, entityType, tab)) {
    throw new Error(`Unknown tab ${tab} for entity type ${entityType}`);
  }

  const entity: CandidateOpenEntity = { assembly, entityID, entityType, tab };

  if (!isValidOpenEntity(entity)) {
    throw new Error(`Incorrect entity configuration: ` + JSON.stringify(entity));
  }

  /**
   * Find the component to render. Components rendered for a given entity are defined in common/entityTabsConfig
   */
  const ComponentToRender = getComponentForEntity(entity);

  /**
   * Ignoring eslint error for having page view component defined in the render function.
   * Normally this is bad: https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components
   *
   * In this case it's okay since this file is only re-rendered on route change
   * (when the component needs to be redefined anyways)
   */
  // eslint-disable-next-line react-hooks/static-components
  return <ComponentToRender entity={entity} />;
}
