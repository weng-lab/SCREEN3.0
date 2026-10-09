import { useMeasuredHeightVar } from "./useMeasuredHeightVar";

/**
 * Exposes the entity header's height as the --entity-header-height CSS variable.
 * Call where #entity-header renders (EntityDetailsLayout). Its height varies with the entity's title,
 * subtitle and how its action buttons wrap, and pages that fill the window take it off their height.
 */
export const useEntityHeaderHeight = () => useMeasuredHeightVar("#entity-header", "--entity-header-height");
