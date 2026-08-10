import * as React from "react";

type HumanIconProps = {
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  size?: number;
  halo?: boolean;
};

const HumanIcon = ({
  color = "black",
  stroke = "none",
  strokeWidth = 1,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  size = 256,
  halo = true,
}: HumanIconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M176.72 97.14V191.85L170.25 176.63C167.58 171.1 165.87 162.45 165.2 156.34L158.72 103.45C158.72 103.45 151.92 133.06 151.23 137.67C149.13 151.68 155.18 164.94 159.31 179.97C163.27 194.37 166.74 208.37 167.77 227.67H135.13L129.02 194L122.91 227.67H90.37C91.4 208.37 94.87 193.47 98.74 179.97C103.04 164.99 108.93 151.68 106.82 137.67C106.14 133.06 99.32 103.45 99.32 103.45L92.84 156.34C92.18 162.45 90.47 171.1 87.8 176.63L81.32 191.85V97.14C81.32 92.98 82.45 88.98 84.48 85.53C86.52 82.06 89.45 79.14 93.08 77.1C97.17 74.81 101.79 73.61 106.48 73.61H151.57C156.26 73.61 160.87 74.81 164.97 77.1C168.6 79.14 171.54 82.06 173.57 85.53C175.6 88.98 176.72 92.98 176.72 97.14Z"
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
    <path
      d="M129.02 68.5C140.21 68.5 149.27 59.43 149.27 48.25C149.27 37.07 140.21 28 129.02 28C117.84 28 108.77 37.07 108.77 48.25C108.77 59.43 117.84 68.5 129.02 68.5Z"
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
    <path
      d="M76.53 62.07C49.29 97.24 42.3 144.39 56.32 186.09C60.96 199.85 67.99 212.86 77.52 224.97C70.85 221.06 64.91 215.82 59.72 209.91C23.27 168.14 28.79 93.04 76.53 62.07Z"
      fill={!halo ? "transparent" : color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
    <path
      d="M181.52 62.07C229.26 93.05 234.76 168.13 198.32 209.91C193.14 215.83 187.2 221.06 180.53 224.97C190.06 212.86 197.09 199.84 201.72 186.09C215.76 144.39 208.75 97.25 181.52 62.07Z"
      fill={!halo ? "transparent" : color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
  </svg>
);

export default HumanIcon;
