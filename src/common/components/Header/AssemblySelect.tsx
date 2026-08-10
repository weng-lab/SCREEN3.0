"use client";
import { useRef, useState } from "react";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HumanIcon from "common/components/HumanIcon";
import MouseIcon from "common/components/MouseIcon";
import { Assembly } from "common/types/globalTypes";

export type AssemblySelectProps = {
  assembly: Assembly;
  onAssemblyChange: (assembly: Assembly) => void;
};

/** Human/Mouse switcher for the desktop toolbar. Controlled so the mobile drawer can share the value. */
export default function AssemblySelect({ assembly, onAssemblyChange }: AssemblySelectProps) {
  const [iconMenuAnchor, setIconMenuAnchor] = useState<null | HTMLElement>(null);
  const dropdownRef = useRef<HTMLButtonElement | null>(null);

  const handleIconMenuOpen = () => {
    if (dropdownRef.current) {
      setIconMenuAnchor(dropdownRef.current);
    }
  };

  const handleIconMenuClose = () => {
    setIconMenuAnchor(null);
  };

  const handleIconSelect = (icon: Assembly) => {
    onAssemblyChange(icon);
    handleIconMenuClose();
  };

  return (
    <Stack direction="row" alignItems="center" spacing={-1}>
      <IconButton onClick={handleIconMenuOpen}>
        {assembly === "GRCh38" ? <HumanIcon color="white" size={45} /> : <MouseIcon color="white" size={45} />}
      </IconButton>
      <IconButton
        ref={dropdownRef}
        onClick={handleIconMenuOpen}
        size="small"
        sx={{ color: "white" }}
        aria-controls={iconMenuAnchor ? "icon-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={iconMenuAnchor ? "true" : undefined}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        id="icon-menu"
        anchorEl={iconMenuAnchor}
        open={Boolean(iconMenuAnchor)}
        onClose={handleIconMenuClose}
        slotProps={{ paper: { sx: { minWidth: 120, mt: 1 } } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem selected={assembly === "GRCh38"} onClick={() => handleIconSelect("GRCh38")}>
          Human
        </MenuItem>
        <MenuItem selected={assembly === "mm10"} onClick={() => handleIconSelect("mm10")}>
          Mouse
        </MenuItem>
      </Menu>
    </Stack>
  );
}
