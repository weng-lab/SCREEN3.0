import type { MetadataRoute } from "next";
import { parseReleaseDay, RELEASE_NOTES } from "app/about/versions/releaseNotes";

const PRODUCTION_URL = "https://screen.wenglab.org";

/**
 * Canonical origin for this deployment. Backs `metadataBase`, so it resolves every canonical
 * link, OpenGraph image and sitemap entry.
 *
 * Sitemap entries must be on the same host as the sitemap serving them -- Google discards
 * cross-host URLs -- so this has to track where the app is actually served.
 *
 * Production deliberately keeps the hardcoded domain rather than reading VERCEL_URL: on Vercel
 * that variable is the generated deployment hostname (screen-<hash>-<team>.vercel.app), not the
 * custom domain, even for production deploys. Using it there would point canonicals at a URL
 * users never visit and split ranking signals across two hosts.
 *
 * Preview deployments use their own origin so share cards and canonicals resolve to the
 * deployment being previewed instead of reaching into production -- which is what makes it
 * possible to test an OpenGraph card before it ships. Vercel serves previews with
 * X-Robots-Tag: noindex, so these origins never reach a search index.
 *
 * Everywhere else (local dev, CI) falls back to production, which keeps a local `yarn build`
 * comparable with what production emits.
 *
 * Read at build time: robots.txt and sitemap.xml are statically generated, so each deployment
 * bakes in its own origin.
 */
export const SITE_URL =
  process.env.VERCEL_ENV !== "production" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : PRODUCTION_URL;

/**
 * Latest release date as YYYY-MM-DD, or undefined when the newest entry carries no exact day
 * (legacy year-only releases) or is malformed.
 *
 * Assumes RELEASE_NOTES is ordered newest-first, which is also the order the versions page
 * renders it in.
 */
function latestReleaseDate(): string | undefined {
  const date = RELEASE_NOTES[0]?.date;
  return date && parseReleaseDay(date) ? date : undefined;
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
