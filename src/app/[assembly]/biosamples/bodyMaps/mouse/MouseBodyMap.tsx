import SVGMap from "../SvgMap";
import { MouseColorMap, MouseList } from "./mouseMapping";
import { mousePaths } from "./mousePathsArray";

interface MouseBodyMapProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function MouseBodyMap({ selected, setSelected }: MouseBodyMapProps) {

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
    />
  );
}
