import * as React from "react";

type MouseIconProps = {
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  size?: number;
};

const MouseIcon = ({
  color = "black",
  stroke = "none",
  strokeWidth = 1,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  size = 256,
}: MouseIconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M75.49 77.16C102.21 57.84 121.9 56.03 129.8 56.26H129.82L134.05 67.77C134.05 67.81 133.9 71.81 141.17 77.66C156.84 89.48 199.12 100.52 199.12 138.06C197.63 168.99 177.32 178.6 168.74 181.3C166.68 181.95 164.52 182.25 162.37 182.25H112.32C109.81 182.25 108.05 179.79 108.86 177.42C111.5 169.68 116.53 154.7 118.21 148.23C120.49 139.41 125.72 128.11 117.12 116.93C106.86 103.35 76.9 93.71 74.06 80.82C73.75 79.44 74.33 78 75.49 77.16ZM108.66 71.61C105.71 71.61 103.32 74 103.32 76.95C103.32 79.9 105.71 82.29 108.66 82.29C111.61 82.29 114 79.9 114 76.95C114 74 111.61 71.61 108.66 71.61Z"
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
    <path
      d="M203.57 139.5C209.09 183.47 171.6 221.54 128.06 221.2C88.84 221.55 53.63 190.36 52.06 150.78C51.89 147.15 52.1 143.09 52.55 139.5C52.9 141.59 53.37 144.71 53.85 146.81C60.98 181.95 91.9 209.06 128.06 208.82C167.49 208.89 198.88 178.08 203.57 139.49V139.5Z"
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
    <path
      d="M148.26 76.5C159.44 76.5 168.51 67.43 168.51 56.25C168.51 45.07 159.44 36 148.26 36C137.08 36 128.01 45.07 128.01 56.25C128.01 67.43 137.08 76.5 148.26 76.5Z"
      fill={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
    />
  </svg>
);

export default MouseIcon;
