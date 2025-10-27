import SVGMap from "../SvgMap";
import { MouseColorMap, MouseList } from "./mouseMapping";
import { mousePaths } from "./mousePathsArray";

export default function MouseBodyMap() {
  // const [selected, setSelected] = useState<string | null>(null);

  return (
    <SVGMap
      paths={mousePaths}
      BodyList={MouseList}
      ColorMap={MouseColorMap}
      viewBox="0 0 1500 900"
      width="700px"
      height="400px"
    />
  );
}
