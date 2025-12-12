"use client";

import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Footer from "common/components/Footer";
import Header from "common/components/Header/Header";
import ScrollReset from "./ScrollReset";

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

  return (
    <Stack height={"100vh"} minHeight={0} id="app-wrapper">
      <Header maintenance={maintenance} />
      {/* Overflow=auto provides scrolling ancestor for OpenElementsTab. This allows it to be position=sticky with top=0, and right under AppBar*/}
      <Stack flexGrow={1} overflow={"auto"} minHeight={0} id="content-wrapper">
        <ScrollReset />
        <Stack flexGrow={1}>{children}</Stack>
        <Footer />
      </Stack>
    </Stack>
  );
}
