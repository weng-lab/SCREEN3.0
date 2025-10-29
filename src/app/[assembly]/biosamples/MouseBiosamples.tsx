import React, { useState } from "react";
import { Stack } from "@mui/material";
import Insets from "./bodyMaps/InsetSvgs";
import MouseBodyMap from "./bodyMaps/mouse/MouseBodyMap";
import { MouseCellsList } from "./bodyMaps/mouse/mouseMapping";

export default function Mouse() {
  const [selected, setSelected] = useState<string>("");

  return (
    <Stack>
      <MouseBodyMap selected={selected} setSelected={setSelected} />
      <Insets Assembly="mm10" cellsList={MouseCellsList} selected={selected} setSelected={setSelected} />
    </Stack>
  );
}
