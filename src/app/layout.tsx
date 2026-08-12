import type { Metadata } from "next";
import { SITE_URL } from "./sitemap";
import { SITE_NAME, TITLE_TEMPLATE } from "common/seo";

const HOMEPAGE_DESCRIPTION =
  "Explore candidate cis-regulatory elements (cCREs) from ENCODE. Search genes, cCREs, variants, GWAS studies, and genomic regions across human (GRCh38) and mouse (mm10).";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Analytics } from "@vercel/analytics/next";
import { ApolloWrapper } from "common/apollo/ApolloWrapper";
import { OpenEntitiesContextProvider } from "common/OpenEntitiesContext";
import { MenuControlProvider } from "common/components/MenuContext";
import MuiXLicense from "common/components/MuiXLicense";
import { Suspense } from "react";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import ClientAppWrapper from "common/components/ClientAppWrapper";
import Theme from "common/components/Theme";

/**
 * Site-wide metadata defaults, which double as the homepage's own metadata -- page.tsx is a
 * client component and so cannot export `metadata` itself.
 *
 * Every other indexable page overrides `title` and `description` (via its own layout.tsx where
 * that page is also a client component). Anything that doesn't inherits the values below, so
 * keep them accurate for the homepage specifically rather than generic boilerplate.
 *
 * `template` applies to child pages that set a string title: "Downloads" renders as
 * "Downloads | SCREEN". `default` is used as-is, with no template applied.
 *
 * Deliberately no `alternates.canonical` here: metadata is inherited, so a canonical set at the
 * root would point every page that forgets to override it at the homepage and deindex it.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE",
    template: TITLE_TEMPLATE,
  },
  description: HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE",
    description: HOMEPAGE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE",
    description: HOMEPAGE_DESCRIPTION,
  },
};

if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <ApolloWrapper>
            <AppRouterCacheProvider>
              <Theme>
                <MenuControlProvider>
                  <OpenEntitiesContextProvider>
                    {/* Overall wrapper set to be screen height */}
                    <ClientAppWrapper>{children}</ClientAppWrapper>
                  </OpenEntitiesContextProvider>
                </MenuControlProvider>
              </Theme>
            </AppRouterCacheProvider>
          </ApolloWrapper>
        </Suspense>
        <CssBaseline />
        <MuiXLicense />
        <Analytics />
      </body>
    </html>
  );
}
