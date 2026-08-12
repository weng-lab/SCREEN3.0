import { pageMetadata } from "common/seo";

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
  return children;
}
