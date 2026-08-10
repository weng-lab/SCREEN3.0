"use client";
import * as React from "react";
import { useState } from "react";
import { Box, Menu, MenuItem, Stack } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { LinkComponent } from "../LinkComponent";
import { PageInfo } from "./types";

/**
 * A single top level nav link. Pages with subpages own their own dropdown anchor,
 * so adding another dropdown needs no coordination with its siblings.
 */
function NavItem({ page }: { page: PageInfo }) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenDropdown = (event: React.MouseEvent<HTMLElement>) => {
    if (page.subPages) {
      setAnchor(event.currentTarget);
    }
  };

  const handleCloseDropdown = () => setAnchor(null);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      onMouseMove={handleOpenDropdown}
      onMouseLeave={handleCloseDropdown}
      sx={{ mr: 2 }}
    >
      <LinkComponent display={"flex"} color="primary.contrastText" href={page.link} underline="none">
        {page.pageName}
        {page.subPages && <ArrowDropDownIcon />}
      </LinkComponent>
      {/* Create popup menu if page has subpages */}
      {page.subPages && (
        <Menu
          id={`${page.pageName}-dropdown-appbar`}
          anchorEl={anchor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={Boolean(anchor)}
          onClose={handleCloseDropdown}
          slotProps={{
            paper: {
              onMouseLeave: handleCloseDropdown,
              sx: { pointerEvents: "auto" },
            },
          }}
          sx={{ pointerEvents: "none", zIndex: 2000 }} //z index of AppBar is 1100 for whatever reason
        >
          {page.subPages.map((subPage) => (
            <LinkComponent key={subPage.pageName} color="#000000" href={subPage.link}>
              <MenuItem>{subPage.pageName}</MenuItem>
            </LinkComponent>
          ))}
        </Menu>
      )}
    </Box>
  );
}

export type DesktopNavProps = {
  pageLinks: PageInfo[];
};

/** Main navigation items for desktop */
export default function DesktopNav({ pageLinks }: DesktopNavProps) {
  return (
    <Stack spacing={3} direction={"row"} display={{ xs: "none", md: "flex" }} alignItems={"center"}>
      {pageLinks.map((page) => (
        <NavItem key={page.pageName} page={page} />
      ))}
    </Stack>
  );
}
