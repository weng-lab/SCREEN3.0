import { Rect } from "@weng-lab/genomebrowser";
import { chromHmmStateDetails } from "../constants";

export const ChromHmmTooltip = (rect: Rect, tissue: string, displayName: string) => {
  return (
    <g>
      <rect width={240} height={92} fill="white" stroke="none" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.2))" />
      <rect width={15} height={15} fill={chromHmmStateDetails[rect.name].color} x={10} y={10} />
      <text x={35} y={22} fontSize={12} fontWeight="bold">
        {chromHmmStateDetails[rect.name].description}({chromHmmStateDetails[rect.name].stateno})
      </text>
      <text x={10} y={40} fontSize={12}>
        {rect.name}
      </text>
      <text x={10} y={58} fontSize={12}>
        {tissue}
      </text>
      <text x={10} y={76} fontSize={12}>
        {displayName}
      </text>
    </g>
  );
}