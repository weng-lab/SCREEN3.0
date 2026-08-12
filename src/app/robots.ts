import type { MetadataRoute } from "next";
import { SITE_URL } from "./sitemap";

/**
 * Crawler policy: deny by default, allowing only the static pages in the top nav
 * (see common/components/Header/navLinks.ts).
 *
 * Entity pages at /{assembly}/{entityType}/{entityID}/{tab} span an effectively unbounded
 * URL space -- /{assembly}/region/{chr}:{start}-{end} accepts any genomic coordinate, so
 * there is no finite set of URLs for a crawler to work through and a crawl never finishes.
 * Each request also costs an SSR render plus a fan-out of client-side /api/graphql calls,
 * so an unattended crawl runs up hosting usage indefinitely. Googlebot, Applebot and
 * AhrefsBot have all done exactly this.
 *
 * Keep this deny-by-default rather than listing routes to block: the dynamic routes sit at
 * the root (/GRCh38/..., /mm10/...) and share no prefix, so there is nothing to target. New
 * routes are therefore blocked unless added to `allow` below.
 *
 * Scope: this only stops well-behaved crawlers, and it cannot remove URLs already indexed
 * (a blocked page can't be re-crawled to see a noindex). Scrapers that ignore robots.txt
 * need to be handled at the edge instead.
 *
 * Comments here are stripped from the generated /robots.txt, which is public. Keep any
 * detail about internals in this file rather than in the emitted output.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        // Homepage. The $ anchor is load-bearing -- a bare "/" would re-open the entire site.
        "/$",
        // Prefix matches, so /about also covers /about/versions.
        "/about",
        "/downloads",
        // Assets required to render the pages allowed above. Without these Googlebot fetches
        // the homepage, fails to load its images and stylesheets, and scores it as broken. The
        // extension wildcards cover the root-level images in public/ (/helix.png, /treemap.svg,
        // ...) and the /versionScreenshots images on /about/versions, without needing a list
        // that drifts as assets are added.
        "/_next/static/",
        "/assets/",
        "/*.svg$",
        "/*.png$",
        // Social share card from opengraph-image.tsx. Needs its own entry because the route is
        // /opengraph-image?<hash> with no .png extension, so the wildcard above does not cover
        // it. Slackbot, Twitterbot and friends honor robots.txt when fetching preview images --
        // without this the cards render with no image.
        "/opengraph-image",
      ],
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
