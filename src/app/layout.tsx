import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/next";
import { ApolloWrapper } from "common/apollo/apollo-wrapper";
import { OpenEntitiesContextProvider } from "common/OpenEntitiesContext";
import { MenuControlProvider } from "common/components/MenuContext";
import MuiXLicense from "common/components/MuiXLicense";
import { Suspense } from "react";
import { theme } from "./theme";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import ClientAppWrapper from "common/components/ClientAppWrapper";

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
              <ThemeProvider theme={theme}>
                <MenuControlProvider>
                  <OpenEntitiesContextProvider>
                    {/* Overall wrapper set to be screen height */}
                    <ClientAppWrapper>{children}</ClientAppWrapper>
                  </OpenEntitiesContextProvider>
                </MenuControlProvider>
              </ThemeProvider>
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
