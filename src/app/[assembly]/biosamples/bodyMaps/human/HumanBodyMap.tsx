import SVGMap from "../SvgMap";
import { humanPaths } from "./humanPathsArray";
import { HumanColorMap, HumanList } from "./humanMapping";

export default function HumanBodyMap() {
  // const [selected, setSelected] = useState<string | null>(null);

  return (
    <SVGMap
      paths={humanPaths}
      BodyList={HumanList}
      ColorMap={HumanColorMap}
      viewBox="0 0 600 700"
      width="500px"
      height="650px"
    />
  );
}
