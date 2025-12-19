import SVGMap from "../SvgMap";
import { humanPaths } from "./humanPathsArray";
import { HumanColorMap, HumanList } from "./humanMapping";
import { useMediaQuery, useTheme } from "@mui/material";

interface HumanBodyMapProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function HumanBodyMap({ selected, setSelected, hovered, setHovered }: HumanBodyMapProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <SVGMap
      paths={humanPaths}
      BodyList={HumanList}
      ColorMap={HumanColorMap}
      viewBox="0 0 575 725"
      width={isXs ? "350px" : "500px"}
      height={isXs ? "400px" : "550px"}
      selected={selected}
      setSelected={setSelected}
      hovered={hovered}
      setHovered={setHovered}
    />
  );
}
