import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

type Figure = {
  title: string;
  component: React.ReactNode;
};

type FigurePanelProps = {
  value: number;
  figures: Figure[];
  tableOpen: boolean;
  tableHeight: string | number;
};

export default function FigurePanel({ value, figures, tableOpen, tableHeight }: FigurePanelProps) {
  const [mountedTabs, setMountedTabs] = useState<number[]>([value]);

  useEffect(() => {
    setMountedTabs((tabs) => (tabs.includes(value) ? tabs : [...tabs, value]));
  }, [value]);

  return (
    <>
      {figures.map((Figure, i) => {
        const isActive = value === i;
        const isMounted = mountedTabs.includes(i);

        return (
          <Box
            key={`figure-${i}`}
            display={isActive ? "block" : "none"}
            id="figure_container"
            //use table height unless its not open, then set px height for umap so it doesnt slowly resize
            height={tableOpen ? tableHeight : Figure.title === "UMAP" ? "700px" : "100%"}
            maxHeight={Figure.title !== "Bar Plot" ? "700px" : "none"}
            minHeight="580px"
          >
            {isMounted && Figure.component}
          </Box>
        );
      })}
    </>
  );
}
