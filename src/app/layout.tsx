import { CssBaseline, Stack } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/next";
import { ApolloWrapper } from "common/apollo/apollo-wrapper";
import Footer from "common/components/Footer";
import Header from "common/components/Header/Header";
import { OpenEntitiesContextProvider } from "common/EntityDetails/OpenEntitiesTabs/OpenEntitiesContext";
import { MenuControlProvider } from "common/MenuContext";
import MuiXLicense from "common/MuiXLicense";
import { Suspense } from "react";
import { theme } from "./theme";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

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
                    <Stack height={"100vh"} minHeight={0} id="app-wrapper">
                      <Header maintenance={false} />
                      {/* Overflow=auto provides scrolling ancestor for OpenElementsTab. This allows it to be position=sticky with top=0, and right under AppBar*/}
                      <Stack flexGrow={1} overflow={"auto"} minHeight={0} id="content-wrapper">
                        <Stack flexGrow={1}>{children}</Stack>
                        <Footer />
                      </Stack>
                    </Stack>
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
