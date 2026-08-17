import type { Metadata } from "next";

/** Suffix applied to child page titles, e.g. "Downloads" -> "Downloads | SCREEN". */
export const TITLE_TEMPLATE = "%s | SCREEN";

export const SITE_NAME = "SCREEN";

/**
 * The generated share card (app/opengraph-image.tsx).
 *
 * Referenced explicitly because a segment that declares its own `openGraph` replaces the
 * parent's wholesale, including the image the file convention injects at the root. Without
 * this every page except the homepage ships an image-less card.
 */
const OG_IMAGE = "/opengraph-image";

/**
 * Builds a page's metadata block.
 *
 * Exists so `title` and `description` reach <title>, <meta name="description">, OpenGraph and
 * Twitter from a single source. Written out by hand these drift -- someone updates the meta
 * description and leaves og:description describing the old page.
 *
 * `title` is passed bare (no "| SCREEN"): the parent template adds the suffix to the page title,
 * while og:title intentionally stays unbranded because `og:site_name` already carries it.
 *
 * `template` is always set so any child segment keeps the suffix. It is a no-op for pages that
 * have no children, and omitting it is the bug that silently strips branding one level down.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Root-relative, e.g. "/downloads". Resolved against `metadataBase`. */
  path: string;
}): Metadata {
  return {
    title: { default: title, template: TITLE_TEMPLATE },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
