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

export const metadata = {
  title: "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE",
  description: "SCREEN: Search Candidate cis-Regulatory Elements by ENCODE",
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
