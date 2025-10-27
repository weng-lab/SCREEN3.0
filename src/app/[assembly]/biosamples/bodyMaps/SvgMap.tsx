import React from "react";
import { useState, useMemo } from "react";

interface BodyListMap {
  [organ: string]: string[];
}

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
}

export default function SVGMap({ BodyList, ColorMap, paths }: SvgMapProps) {
  const [activeOrgan, setActiveOrgan] = useState<string | null>(null);
  const [hoveredCls, setHoveredCls] = useState<string | null>(null);

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
    setActiveOrgan((prev) => (prev === organ ? null : organ));
  };

  const handleHover = (cls: string | null) => {
    setHoveredCls(cls);
  };

  const getStyle = (cls: string) => {
    const path = ColorMap[cls];
    if (!path) return {};

    const isActive = activeOrgan && BodyList[activeOrgan]?.includes(cls);
    const isHovered = hoveredCls === cls;

    if (path.outlineOnly) {
      return {
        fill: path.fill,
        stroke: isActive ? (path.activeFill ?? path.fill) : isHovered ? "#63326eaa" : "none",
        opacity: path.opacity ?? 1,
        strokeWidth: 1.5,
        cursor: "pointer",
        transition: "stroke 0.2s ease",
      };
    }

    return {
      fill: isActive ? (path.activeFill ?? path.fill) : isHovered ? "#63326eaa" : path.fill,
      stroke: isActive ? (path.activeStroke ?? "none") : (path.stroke ?? "none"),
      opacity: path.opacity ?? 1,
      transition: "fill 0.2s ease",
      cursor: "pointer",
    };
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" style={{ width: "500px", height: "650px" }}>
      {paths.map((el, i) => {
        const tag = el.tag;
        const props = el.props;
        const cls = props.className ?? "";
        const style = getStyle(cls);

        // skip rendering if no BodyList match or no fill
        const colorData = ColorMap[cls];
        if (!classToOrgan[cls] || !colorData?.fill) return null;

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

// {paths.map((p, i) => {
//         const cls = p.className;
//         const organ = classToOrgan[cls];
//         const color = ColorMap[cls];

//         // Skip rendering if no organ match or no fill
//         if (!organ && (!color || !color.fill)) return null;

//         return (
//           <path
//             key={i}
//             className={cls}
//             d={p.d}
//             style={getStyle(cls)}
//             onClick={() => handleClick(cls)}
//             onMouseEnter={() => handleHover(cls)}
//             onMouseLeave={() => handleHover(null)}
//           />
//         );
//       })}
