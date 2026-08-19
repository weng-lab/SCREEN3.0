import { pageMetadata } from "common/seo";
import { DOWNLOADS_STRUCTURED_DATA } from "./structuredData";

/**
 * Exists so /downloads gets its own title and description -- page.tsx is a client component
 * and cannot export `metadata` itself.
 */
export const metadata = pageMetadata({
  title: "Download cCRE Data",
  description:
    "Download ENCODE candidate cis-regulatory element (cCRE) annotations, signal and z-score data matrices, and cCREs within a specific genomic region, for human (GRCh38) and mouse (mm10).",
  path: "/downloads",
});

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Dataset markup for Google Dataset Search. Rendered here rather than through
        `pageMetadata` because Next's metadata API has no JSON-LD support -- the script tag has
        to be emitted by hand. It lives in this server component so it ships in the initial HTML.
      */}
      <script type="application/ld+json">{JSON.stringify(DOWNLOADS_STRUCTURED_DATA)}</script>
      {children}
    </>
  );
}
