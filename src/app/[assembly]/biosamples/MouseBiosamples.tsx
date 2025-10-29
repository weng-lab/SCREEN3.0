import React, { useState } from "react";
import { Stack } from "@mui/material";
import Insets from "./bodyMaps/InsetSvgs";
import MouseBodyMap from "./bodyMaps/mouse/MouseBodyMap";
import { MouseCellsList } from "./bodyMaps/mouse/mouseMapping";
import BiosampleTables from "common/components/BiosampleTables/BiosampleTables";

export default function Mouse() {
  const [selected, setSelected] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} marginTop={2}>
      <Stack>
        <MouseBodyMap selected={selected} setSelected={setSelected} hovered={hovered} setHovered={setHovered} />
        <Insets
          Assembly="mm10"
          cellsList={MouseCellsList}
          selected={selected}
          setSelected={setSelected}
          hovered={hovered}
          setHovered={setHovered}
        />
      </Stack>
      <BiosampleTables
        assembly={"mm10"}
        slotProps={{
          paperStack: { overflow: "auto", flexGrow: 1, height: "800px" },
        }}
      />
    </Stack>
  );
}
