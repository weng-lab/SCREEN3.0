import React from "react";
import { BulkBedRect } from "@weng-lab/genomebrowser";
import { chromHmmStateDetails } from "../constants";

interface ChromHmmTooltipProps {
  rect: BulkBedRect;
  tissue: string;
  displayName: string;
}

const ChromHmmTooltip: React.FC<ChromHmmTooltipProps> = ({ rect, tissue, displayName }) => {
  const stateDetails = chromHmmStateDetails[rect.name];

  if (!stateDetails) {
    return (
      <svg width={240} height={50}>
        <rect width={240} height={50} fill="white" stroke="#000000" strokeWidth="2" rx="4" ry="4" />
        <text x={10} y={30} fontSize={12} fill="#000000">
          Unknown state: {rect.name}
        </text>
      </svg>
    );
  }

  return (
    <svg width={240} height={92}>
      <rect width={240} height={70} fill="white" rx="4" ry="4" style={{ filter: `drop-shadow(0 0 2px #000000)` }} />
      <rect width={15} height={15} fill={stateDetails.color} x={10} y={10} />
      <text x={35} y={22} fontSize={12} fontWeight="bold" fill="#000000">
        {stateDetails.description} ({stateDetails.stateno})
      </text>
      <text x={10} y={40} fontSize={12} fill="#000000">
        {rect.name}
      </text>
      <text x={10} y={58} fontSize={12} fill="#000000">
        {tissue}
      </text>
    </svg>
  );
};

export default ChromHmmTooltip;
