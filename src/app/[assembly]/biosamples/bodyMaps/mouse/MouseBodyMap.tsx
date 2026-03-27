import { useMediaQuery, useTheme } from "@mui/material";
import SVGMap from "../SvgMap";
import { MouseColorMap, MouseList } from "./mouseMapping";
import { mousePaths } from "./mousePathsArray";

interface MouseBodyMapProps {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  onHoverChange: (organ: string | null) => void;
}

export default function MouseBodyMap({ selected, setSelected, onHoverChange }: MouseBodyMapProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <SVGMap
      paths={mousePaths}
      BodyList={MouseList}
      ColorMap={MouseColorMap}
      viewBox={isXs ? "0 0 1900 600" : "0 0 1350 600"}
      width="500px"
      height={isXs ? "200px" : "300px"}
      selected={selected}
      setSelected={setSelected}
      onHoverChange={onHoverChange}
    />
  );
}
