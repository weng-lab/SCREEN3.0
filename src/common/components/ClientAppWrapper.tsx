"use client";

import { useEffect, useState } from "react";
import { Box, GlobalStyles } from "@mui/material";
import Footer from "common/components/Footer";
import Header from "common/components/Header/Header";
import { useHeaderHeight } from "common/hooks/ui";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);

  // Keeps --header-height accurate on every page so hash-link scroll targets
  // can offset for the sticky header (see scroll-padding-top rule below).
  useHeaderHeight();
  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "{ __typename }" }),
        });

        if (!res.ok) throw new Error("API down");
        const json = await res.json();
        if (json.errors || !json.data) throw new Error("API returned errors");
      } catch (err) {
        console.error("API unreachable:", err);
        setMaintenance(true);
      }
    };
    checkAPIHealth();
  }, []);

  return (
    <Box id="app-wrapper" display={"grid"} gridTemplateRows={"auto minmax(0, 1fr) auto"} minHeight={"100vh"}>
      {/* Offset hash-link scroll targets so they aren't hidden behind the sticky header.
          Applied via scroll-padding-top on the scroll root (rather than :target scroll-margin)
          so it also works for Next.js soft navigation, which scrolls programmatically. */}
      <GlobalStyles
        styles={{
          html: { scrollPaddingTop: "calc(var(--header-height, 64px) + 8px)" },
        }}
      />
      <Header maintenance={maintenance} />
      {/* Wrap children to enure they will all be slotted together into the 1fr row if child is a fragment */}
      <div id="main-content-wrapper">{children}</div>
      <Footer />
    </Box>
  );
}
