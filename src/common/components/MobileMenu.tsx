"use client";
import { Search } from "@mui/icons-material";
import { Box, Divider, Drawer, IconButton, List, ListItem, Stack, useMediaQuery, useTheme } from "@mui/material";
import MuiLink from "@mui/material/Link";
import AutoComplete from "./autocomplete";
import Link from "next/link";
import { PageInfo } from "./Header";
import CloseIcon from "@mui/icons-material/Close";
import { useMenuControl } from "common/MenuContext";
import { useEffect } from "react";

export type MobileMenuProps = {
  pageLinks: PageInfo[];
};

export default function MobileMenu({ pageLinks }: MobileMenuProps) {
  const { isMenuOpen, setMenuCanBeOpen, closeMenu, setIsMenuMounted } = useMenuControl();

  const theme = useTheme();
  // This breakpoint needs to match the breakpoints used below
  // Not using this below to prevent layout shift on initial load
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (isDesktop) {
      setMenuCanBeOpen(false);
    } else setMenuCanBeOpen(true);
  }, [isDesktop, setMenuCanBeOpen]);

  const handleCloseDrawer = () => {
    setIsMenuMounted(false);
    closeMenu();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={handleCloseDrawer}
        SlideProps={{
          onEntered: () => setIsMenuMounted(true),
          onExited: () => setIsMenuMounted(false)
        }}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <IconButton sx={{ color: "black" }} onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
            <AutoComplete
              id="mobile-search-component"
              style={{ width: "100%" }}
              closeDrawer={handleCloseDrawer}
              slots={{
                button: (
                  <IconButton sx={{ color: "black" }}>
                    <Search />
                  </IconButton>
                ),
              }}
              slotProps={{
                box: { gap: 1 },
                input: {
                  size: "small",
                  label: "Enter a gene, iCRE, variant or locus",
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#ffffff",
                    },
                  },
                },
                button: {
                  onClick: handleCloseDrawer,
                },
              }}
            />
          </Stack>
          <br />
          <Divider />
          <List>
            {pageLinks
              .map((page) => (
                <Box key={page.pageName} sx={{ mb: 1 }}>
                  <ListItem onClick={handleCloseDrawer}>
                    <MuiLink
                      component={Link}
                      href={page.link}
                      sx={{
                        color: "black",
                        textTransform: "none",
                        justifyContent: "start",
                        width: "100%",
                      }}
                      underline="none"
                    >
                      {page.pageName}
                    </MuiLink>
                  </ListItem>
                  {page.subPages && (
                    <List sx={{ pl: 2 }}>
                      {page.subPages.map((subPage) => (
                        <ListItem key={subPage.pageName} sx={{ py: 0 }} onClick={handleCloseDrawer}>
                          <MuiLink component={Link} href={subPage.link} sx={{ color: "gray", textTransform: "none" }} underline="none">
                            {subPage.pageName}
                          </MuiLink>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <Divider />
                </Box>
              ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
