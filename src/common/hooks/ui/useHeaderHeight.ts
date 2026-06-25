import { useMeasuredHeightVar } from "./useMeasuredHeightVar";

/**
 * Exposes the sticky app header's height as the --header-height CSS variable.
 * Call once near the app root (ClientAppWrapper) so it's available on every page — sticky
 * offsets and hash-link scroll padding depend on it.
 */
export const useHeaderHeight = () => useMeasuredHeightVar("header", "--header-height");
