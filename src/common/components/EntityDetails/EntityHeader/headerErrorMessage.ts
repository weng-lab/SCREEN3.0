import { AnyEntityType, formatPortal } from "common/entityTabsConfig";

type PrimaryFetch = {
  loading: boolean;
  error: unknown;
  /** Whatever the header fetched to describe its entity. Absent once loading means not found */
  data: unknown;
};

/**
 * The message a header shows in place of its subtitle when the fetch describing its entity fails or
 * comes back empty. Null when there is nothing wrong, so the result can go straight to
 * EntityHeaderLayout's errorMessage.
 *
 * Only for the fetch the header is built around. A secondary fetch that costs part of the subtitle
 * should use AsyncText, so the rest of the line still renders.
 */
export const headerErrorMessage = (
  entityType: AnyEntityType,
  entityID: string,
  { loading, error, data }: PrimaryFetch
) => {
  if (error) return `Error fetching ${formatPortal(entityType)} details`;
  if (!loading && !data) return `No ${formatPortal(entityType)} found with ID ${entityID}`;

  return null;
};
