import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BodyListMap } from "./types";
import { Assembly } from "common/types/globalTypes";

type InsetProps = {
  Assembly: Assembly;
  cellsList: BodyListMap;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
};

const Insets: React.FC<InsetProps> = ({ Assembly, cellsList, selected, setSelected, hovered, setHovered }) => {
  const isSelected = (organ: string) => selected === organ;

  const imagePrefix = Assembly === "mm10" ? "mouse_" : "";

  const handleClick = (organ: string) => {
    if (!organ) return;
    setSelected((prev) => (prev === organ ? null : organ));
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: 1.5,
        justifyItems: "center",
        alignItems: "center",
        mt: 2,
        width: "500px",
      }}
    >
      {Object.keys(cellsList).map((organ) => {
        const active = isSelected(organ);
        const src = `/insetSVGs/${imagePrefix}${organ.replace(" ", "_")}${active ? "" : "_deselected"}.svg`;

        return (
          <Button
            key={organ}
            onClick={() => handleClick(organ)}
            onMouseEnter={() => setHovered(organ)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              minWidth: 0,
              p: 0,
              background: "none",
              border: "none",
              position: "relative",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            <Box
              component="img"
              src={src}
              alt={organ}
              sx={{
                width: 60,
                height: 60,
                objectFit: "contain",
                display: "block",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                backgroundColor:
                  hovered === organ
                    ? "rgba(128, 90, 213, 0.25)" // soft purple tint when active
                    : "transparent",
                transition: "background-color 0.2s ease",
                pointerEvents: "none", // ensures clicks go through
                "&:hover": {
                  backgroundColor: "rgba(128, 90, 213, 0.25)", // hover tint
                },
              }}
            />
          </Button>
        );
      })}
    </Box>
  );
};

export default Insets;
