import SVGMap from "../SvgMap";
import { humanPaths } from "./humanPathsArray";
import { HumanColorMap, HumanList } from "./humanMapping";

interface HumanBodyMapProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function HumanBodyMap({ selected, setSelected, hovered, setHovered }: HumanBodyMapProps) {
  return (
    <SVGMap
      paths={humanPaths}
      BodyList={HumanList}
      ColorMap={HumanColorMap}
      viewBox="0 0 600 700"
      width="500px"
      height="650px"
      selected={selected}
      setSelected={setSelected}
      hovered={hovered}
      setHovered={setHovered}
    />
  );
}
