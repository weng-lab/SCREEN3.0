import React from "react";
import { useMemo } from "react";
import { BodyListMap, SvgElement } from "./types";

interface ColorMap {
  [cls: string]: {
    fill?: string;
    activeFill?: string;
    stroke?: string;
    activeStroke?: string;
    outlineOnly?: boolean;
    opacity?: number;
    disabled?: boolean;
  };
}

interface SvgMapProps {
  BodyList: BodyListMap;
  ColorMap: ColorMap;
  paths: SvgElement[];
  viewBox?: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  width?: string;
  height?: string;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
}

const clipMap: Record<string, string> = {
  "cls-65": "clip-path-5",
  "cls-77": "clip-path-5",
  "cls-78": "clip-path-5",

  "cls-83": "clip-path-7",
  "cls-84": "clip-path-7",
  "cls-85": "clip-path-7",
  "cls-88": "clip-path-7",
  "cls-89": "clip-path-7",
  "cls-90": "clip-path-7",

  "cls-62": "clip-path",
  "cls-uterus": "clip-path-2",
};

export default function SVGMap({
  BodyList,
  ColorMap,
  paths,
  viewBox,
  width,
  height,
  selected,
  setSelected,
  hovered,
  setHovered,
}: SvgMapProps) {
  const classToOrgan = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(BodyList).forEach(([organ, classes]) => {
      classes.forEach((cls) => {
        map[cls] = organ;
      });
    });
    return map;
  }, [BodyList]);

  const handleClick = (cls: string) => {
    const organ = classToOrgan[cls];
    if (!organ) return;
    setSelected((prev) => (prev === organ ? null : organ));
  };

  const handleHover = (cls: string | null) => {
    const organ = classToOrgan[cls];
    if (!organ) setHovered(null);
    setHovered(organ);
  };

  const getStyle = (cls: string) => {
    const path = ColorMap[cls];
    if (!path) return {};

    const isActive = selected && BodyList[selected]?.includes(cls);
    const isHovered = hovered && BodyList[hovered]?.includes(cls);

    if (path.disabled) {
      return {
        fill: path.fill,
        opacity: 0.3,
        cursor: "not-allowed",
      };
    }

    if (path.outlineOnly) {
      return {
        fill: path.fill,
        stroke: isActive ? (path.activeFill ?? path.fill) : isHovered ? "#63326e79" : "none",
        opacity: path.opacity ?? 1,
        strokeWidth: 1.5,
        cursor: "pointer",
        transition: "stroke 0.2s ease",
      };
    }

    return {
      fill: isActive ? (path.activeFill ?? path.fill) : isHovered ? "#63326e79" : path.fill,
      stroke: isActive ? (path.activeStroke ?? "none") : isHovered ? "#63326eff" : (path.stroke ?? "none"),
      opacity: path.opacity ?? 1,
      transition: "fill 0.2s ease",
      cursor: "pointer",
    };
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} style={{ width: width, height: height }}>
      <defs>
        <clipPath id="clip-path">
          <rect id="SVGID" className="cls-3" x="288.4" y="553.94" width="54.76" height="119.56" />
        </clipPath>
        <clipPath id="clip-path-2">
          <polygon
            id="SVGID-2"
            data-name="SVGID"
            className="cls-3"
            points="206.14 671.39 288.4 673.5 288.4 553.94 206.14 551.83 206.14 671.39"
          />
        </clipPath>
        <clipPath id="clip-path-3">
          <path
            id="SVGID-3"
            data-name="SVGID"
            className="cls-3"
            d="M328.53,50.57A14.06,14.06,0,0,1,330.62,60c-.69,5.63,2.46,4.41,2.43,6.6s-2.88,5.61-4.76,5.59-1.94,5.93-6.65,6.81-18.17.74-18.5,2.3,2.05,12.24-3.93,15-9.81,9-15.13,8.61-5.7,5.88-10.1,7.4-2.25,5.3-10.08,5.21-9.1,2.1-15.34-.17-7.15-5.09-7.14-6.34-14.64-7-13.28-16.74c0-4.7-7.13-6-1.54-16.62.82-2.81-3.17-10.37,4.08-14.36,2.21-1.86-1.14-11,8.6-13.69,2.84-1.22,1-6.56,7.6-7.43s6.34-7.13,13.23-7.06,6-.24,8.48-2.1,6.3-2.74,8.48-2.09,6-1.89,9.4-.09,4.42-3,10-.52,11.27,0,13.72,4.73,5.61,2.88,9.35,4.8,3.37,6.93,4.62,7.26S328.53,50.57,328.53,50.57Z"
          />
        </clipPath>
        <clipPath id="clip-path-4">
          <path
            className="cls-4"
            d="M322.77,83.39s11.17-2.38,14.11-4.34c0,0,.82,6.4-1.59,8.61C335.29,87.66,329,89.1,322.77,83.39Z"
          />
        </clipPath>
        <clipPath id="clip-path-5">
          <path
            id="SVGID-4"
            data-name="SVGID"
            className="cls-3"
            d="M406.11,406.52s24.34-15,36.79-10.13c0,0,12,36.56,17.25,59.59s18.39,125.77,18.39,125.77-11.16,7-23,4.35C455.55,586.1,415.31,482.34,406.11,406.52Z"
          />
        </clipPath>
        <clipPath id="clip-path-7">
          <path className="cls-3" d="M372.92,234.93s-46,135,73,120c0,0,5-98-27-111S372.92,234.93,372.92,234.93Z" />
        </clipPath>
        <clipPath id="clip-path-8">
          <circle className="cls-3" cx="520.17" cy="407.18" r="32.75" />
        </clipPath>
      </defs>
      {paths.map((el, i) => {
        const tag = el.tag;
        const props = el.props;
        const cls = props.className;
        const style = getStyle(cls);

        // skip rendering if no BodyList match or no fill
        const colorData = ColorMap[cls];
        if (!colorData?.fill) return null;

        return React.createElement(tag, {
          key: `${tag}-${i}-${cls}`,
          ...props,
          className: cls,
          style,
          clipPath: clipMap[cls] ? `url(#${clipMap[cls]})` : undefined,
          onClick: () => handleClick(cls),
          onMouseEnter: () => handleHover(cls),
          onMouseLeave: () => handleHover(null),
        });
      })}
    </svg>
  );
}
