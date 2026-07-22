import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BodyListMap } from "./types";
import { Assembly } from "common/types/globalTypes";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { capitalizeWords } from "common/utils";

type InsetProps = {
  Assembly: Assembly;
  cellsList: BodyListMap;
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  onHoverChange: (organ: string | null) => void;
};

const Insets: React.FC<InsetProps> = ({ Assembly, cellsList, selected, setSelected, onHoverChange }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const isSelected = (organ: string) => selected === organ;

  const imagePrefix = Assembly === "mm10" ? "mouse_" : "";

  const handleClick = (organ: string) => {
    if (!organ) return;
    setSelected((prev) => (prev === organ ? null : organ));
  };

  const isHuman = Assembly === "GRCh38";
  const perRow = 4;
  const shiftStart = isHuman ? (isXs ? perRow * 2 + 1 : perRow + 1) : perRow + 1;
  const shiftAmount = isHuman ? "0px" : isXs ? "45px" : "65px";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${perRow}, minmax(70px, 1fr))`,
        gap: 1,
        justifyItems: "center",
        alignItems: "center",
        mt: 2,
        [`& > :nth-child(n+${shiftStart})`]: {
          transform: `translateX(${shiftAmount})`,
        },
      }}
    >
      {Object.keys(cellsList).map((organ) => {
        const active = isSelected(organ);
        const src = `/insetSvgs/${imagePrefix}${organ.replace(/ /g, "_").toLowerCase()}${active ? "" : "_deselected"}.svg`;

        return (
          <Tooltip key={organ} title={capitalizeWords(organ)} arrow>
            <Button
              key={organ}
              className="biosample-inset-button"
              data-organ={organ}
              onClick={() => handleClick(organ)}
              onMouseEnter={() => onHoverChange(organ)}
              onMouseLeave={() => onHoverChange(null)}
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
                className="biosample-inset-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  transition: "background-color 0.2s ease",
                  pointerEvents: "none",
                }}
              />
            </Button>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default Insets;
