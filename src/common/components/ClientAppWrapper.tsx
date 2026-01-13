"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Footer from "common/components/Footer";
import Header from "common/components/Header/Header";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        const res = await fetch("https://screen.api.wenglab.org/graphql", {
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

  /**
   * @todo figure out if we still need the ScrollReset
   * @todo see if MUI's Grid has syntax that makes this even simpler
   */

  return (
    <Box id="app-wrapper" display={"grid"} gridTemplateRows={"auto 1fr auto"} minHeight={"100vh"}>
      <Header maintenance={maintenance} />
      {/* Wrap children to enure they will all be slotted together into the 1fr row */}
      <div id="main-content-wrapper">{children}</div>
      <Footer />
    </Box>
  );
}
