import AppBar from "common/components/HomeAppBar"
import Footer from "common/components/Footer"
import { Box, CssBaseline, Stack } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ApolloWrapper } from "common/apollo/apollo-wrapper"
import { Suspense } from "react"
import MuiXLicense from "common/MuiXLicense";
import { OpenElementsContextProvider } from "common/OpenElementsContext";
import { Analytics } from "@vercel/analytics/next"
import { MenuControlProvider } from "common/MenuContext";

export const metadata = {
  title: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
  description: "igSCREEN: Search Immune Candidate cis-Regulatory Elements by ENCODE",
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
                  <OpenElementsContextProvider>
                    {/* Overall wrapper set to be screen height */}
                    <Stack height={"100vh"} minHeight={0} id="app-wrapper">
                      <AppBar maintenance={false} />
                      {/* Overflow=auto provides scrolling ancestor for OpenElementsTab. This allows it to be position=sticky with top=0, and right under AppBar*/}
                      <Stack flexGrow={1} overflow={"auto"} minHeight={0} id="content-wrapper">
                        <Stack flexGrow={1}>{children}</Stack>
                        <Footer />
                      </Stack>
                    </Stack>
                  </OpenElementsContextProvider>
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
