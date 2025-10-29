import React, { useState } from "react";
import HumanBodyMap from "./bodyMaps/human/HumanBodyMap";
import { Stack } from "@mui/material";
import Insets from "./bodyMaps/InsetSvgs";
import { HumanCellsList } from "./bodyMaps/human/humanMapping";

export default function Human() {
  const [selected, setSelected] = useState<string>("");

  return (
    <Stack>
      <HumanBodyMap selected={selected} setSelected={setSelected} />
      <Insets Assembly="GRCh38" cellsList={HumanCellsList} selected={selected} setSelected={setSelected} />
    </Stack>
  );
}
