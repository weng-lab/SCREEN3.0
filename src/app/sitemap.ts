import type { MetadataRoute } from "next";
import { RELEASE_NOTES } from "app/about/versions/releaseNotes";

/**
 * Canonical origin. Sitemap entries must be on the same host as the sitemap itself --
 * Google discards cross-host URLs -- so this needs to match where the app is actually
 * served, not a preview or legacy domain.
 */
export const SITE_URL = "https://screen.wenglab.org";

/**
 * Latest release date as YYYY-MM-DD, or undefined if it can't be read.
 *
 * Derived from RELEASE_NOTES rather than hardcoded so it stays truthful as releases are
 * added. That matters: Google only honors lastmod when it is "consistently and verifiably
 * accurate", and a stale or always-current value teaches it to ignore the field entirely.
 * For the same reason, do not fall back to new Date() here -- that would stamp the page as
 * modified on every deploy.
 */
function latestReleaseDate(): string | undefined {
  const raw = RELEASE_NOTES[0]?.date;
  if (!raw) return undefined;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return undefined;

  // Built from local parts instead of toISOString(), which shifts the calendar date across
  // the UTC boundary depending on the timezone the build runs in.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/**
 * The pages crawlers are allowed to index, mirroring the allowlist in robots.ts. Keep the
 * two in sync: a sitemap entry that robots.ts blocks is a contradictory signal, and Search
 * Console reports it as an error.
 *
 * `priority` and `changeFrequency` are deliberately omitted -- Google ignores both.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/downloads` },
    { url: `${SITE_URL}/about/versions`, lastModified: latestReleaseDate() },
  ];
}
