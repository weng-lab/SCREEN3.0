import { useMeasuredHeightVar } from "./useMeasuredHeightVar";

/**
 * Exposes the entity tabs bar's height as the --entity-tabs-height CSS variable.
 * Call where #entity-tabs renders (EntityDetailsLayout); the element only exists on entity pages,
 * which is why this is measured here rather than at the app root.
 */
export const useEntityTabsHeight = () => useMeasuredHeightVar("#entity-tabs", "--entity-tabs-height");
