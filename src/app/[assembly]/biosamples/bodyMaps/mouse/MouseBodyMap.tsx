import SVGMap from "../SvgMap";
import { MouseColorMap, MouseList } from "./mouseMapping";
import { mousePaths } from "./mousePathsArray";

interface MouseBodyMapProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function MouseBodyMap({ selected, setSelected, hovered, setHovered }: MouseBodyMapProps) {
  return (
    <SVGMap
      paths={mousePaths}
      BodyList={MouseList}
      ColorMap={MouseColorMap}
      viewBox="0 0 1500 900"
      width="700px"
      height="400px"
      selected={selected}
      setSelected={setSelected}
      hovered={hovered}
      setHovered={setHovered}
    />
  );
}
