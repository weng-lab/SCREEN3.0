import SVGMap from "../SvgMap";
import { humanPaths } from "./humanPathsArray";
import { HumanColorMap, HumanList } from "./humanMapping";

interface HumanBodyMapProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function HumanBodyMap({ selected, setSelected }: HumanBodyMapProps) {
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
    />
  );
}
