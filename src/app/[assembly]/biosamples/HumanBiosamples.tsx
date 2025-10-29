import React, { useState } from "react";
import HumanBodyMap from "./bodyMaps/human/HumanBodyMap";
import { Stack } from "@mui/material";
import Insets from "./bodyMaps/InsetSvgs";
import { HumanCellsList } from "./bodyMaps/human/humanMapping";
import BiosampleTables from "common/components/BiosampleTables/BiosampleTables";

export default function Human() {
  const [selected, setSelected] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} marginTop={2}>
      <Stack>
        <HumanBodyMap selected={selected} setSelected={setSelected} hovered={hovered} setHovered={setHovered} />
        <Insets
          Assembly="GRCh38"
          cellsList={HumanCellsList}
          selected={selected}
          setSelected={setSelected}
          hovered={hovered}
          setHovered={setHovered}
        />
      </Stack>
      <BiosampleTables
        assembly={"GRCh38"}
        onAccordionHover={(organ: string | null) => setHovered(organ)}
        onAccordionClick={(organ) => setSelected((prev) => (prev === organ ? null : organ))}
        slotProps={{
          paperStack: { overflow: "auto", flexGrow: 1, height: "800px" },
        }}
      />
    </Stack>
  );
}
