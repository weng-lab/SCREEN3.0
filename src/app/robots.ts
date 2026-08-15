import type { MetadataRoute } from "next";
import { SITE_URL } from "./sitemap";

/**
 * Crawler policy: deny by default, allowing only the static pages in the top nav
 * (see common/components/Header/navLinks.ts).
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
