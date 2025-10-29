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
          onClick: () => handleClick(cls),
          onMouseEnter: () => handleHover(cls),
          onMouseLeave: () => handleHover(null),
        });
      })}
    </svg>
  );
}
