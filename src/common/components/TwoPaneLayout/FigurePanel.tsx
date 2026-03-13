import React, { useState } from "react";
import Box from "@mui/material/Box";

type Figure = {
  title: string;
  component: React.ReactNode;
};

type FigurePanelProps = {
  value: number;
  figures: Figure[];
};

export default function FigurePanel({ value, figures }: FigurePanelProps) {
  const [mountedTabs, setMountedTabs] = useState<Set<number>>(new Set([value]));

  if (!mountedTabs.has(value)) {
    setMountedTabs(new Set([...mountedTabs, value]));
  }

  return figures.map((Figure, i) => {
    const isActive = value === i;
    const isMounted = mountedTabs.has(i);

    return (
      <Box
        key={`figure-${i}`}
        display={isActive ? "block" : "none"}
        height="100%"
        width={"100%"}
        overflow={"auto"}
        padding={1}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, position: "relative" }}
      >
        {isMounted && Figure.component}
      </Box>
    );
  });
}
