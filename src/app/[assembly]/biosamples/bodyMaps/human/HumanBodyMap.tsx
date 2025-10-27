import SVGMap from "../SvgMap";
import { humanPaths } from "./humanPathsArray";
import { HumanColorMap, HumanList } from "./mapping";

export default function HumanBodyMap() {
  // const [selected, setSelected] = useState<string | null>(null);

  return <SVGMap paths={humanPaths} BodyList={HumanList} ColorMap={HumanColorMap} />;
}
