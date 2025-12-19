import React, { useState } from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import Insets from "./bodyMaps/InsetSvgs";
import MouseBodyMap from "./bodyMaps/mouse/MouseBodyMap";
import { MouseCellsList } from "./bodyMaps/mouse/mouseMapping";
import BiosampleTables from "common/components/BiosampleTables/BiosampleTables";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export default function Mouse() {
  const [selected, setSelected] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [showBodyMap, setShowBodyMap] = useState<boolean>(true);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={4}
      mt={2}
      sx={{
        position: "relative",
        overflow: "hidden",
        alignItems: "stretch",
      }}
      px={1}
    >
      <Tooltip title={showBodyMap ? "Hide Body Map" : "Show Body Map"} placement="bottom">
        <IconButton
          onClick={() => setShowBodyMap((prev) => !prev)}
          sx={{
            position: "absolute",
            top: 10,
            alignSelf: "flex-start",
            zIndex: 2,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          {showBodyMap ? (
            <UnfoldLessIcon sx={{ transform: { sx: "none)", md: "rotate(90deg)" } }} />
          ) : (
            <UnfoldMoreIcon sx={{ transform: { sx: "none", md: "rotate(90deg)" } }} />
          )}
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          width: {
            xs: "100%",
            md: showBodyMap ? 550 : 0,
          },
          height: {
            xs: showBodyMap ? "auto" : 0,
            md: "auto",
          },
          minWidth: 0,
          transition: {
            xs: "height 0.5s ease",
            md: "width 0.6s ease",
          },
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Stack
          sx={{
            opacity: showBodyMap ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <MouseBodyMap selected={selected} setSelected={setSelected} hovered={hovered} setHovered={setHovered} />
          <Insets
            Assembly="mm10"
            cellsList={MouseCellsList}
            selected={selected}
            setSelected={setSelected}
            hovered={hovered}
            setHovered={setHovered}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          transition: {
            xs: "height 0.5s ease",
            md: "all 0.6s ease",
          },
          width: {
            xs: "100%",
            md: showBodyMap ? "calc(100% - 550px)" : "100%",
          },
          height: {
            xs: showBodyMap ? "auto" : "100%",
            md: "auto",
          },
        }}
      >
        <BiosampleTables
          assembly={"mm10"}
          onAccordionHover={(organ: string | null) => setHovered(organ)}
          onAccordionClick={(organ) => setSelected((prev) => (prev === organ ? null : organ))}
          hoveredAccordian={hovered}
          selectedAccordian={selected}
          slotProps={{
            paperStack: { overflow: "auto", flexGrow: 1, height: "700px" },
          }}
        />
      </Box>
    </Stack>
  );
}
