"use client";
import { Search } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MuiLink from "@mui/material/Link";
import AutoComplete from "../autocomplete";
import Link from "next/link";
import { PageInfo } from "./Header";
import CloseIcon from "@mui/icons-material/Close";
import { useMenuControl } from "common/MenuContext";
import { useEffect, useState } from "react";

export type MobileMenuProps = {
  pageLinks: PageInfo[];
};

export default function MobileMenu({ pageLinks }: MobileMenuProps) {
  const { isMenuOpen, setMenuCanBeOpen, closeMenu, setIsMenuMounted } = useMenuControl();
  const [assembly, setAssembly] = useState<"GRCh38" | "mm10">("GRCh38");

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
          onExited: () => setIsMenuMounted(false),
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
              assembly={assembly}
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
                  label: `Enter a gene, cCRE${assembly === "GRCh38" ? ", variant" : ""} or locus`,
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
          <RadioGroup
            value={assembly}
            onChange={(e) => setAssembly(e.target.value as "GRCh38" | "mm10")}
            row
            sx={{
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: 2, sm: 4, md: 6 },
              flexWrap: "wrap",
              my: 1,
            }}
          >
            {["GRCh38", "mm10"].map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio />}
                label={<Typography>{value === "GRCh38" ? "Human" : "Mouse"}</Typography>}
                sx={{ marginRight: 0 }}
              />
            ))}
          </RadioGroup>
          <Divider />
          <List>
            {pageLinks.map((page) => (
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
                        <MuiLink
                          component={Link}
                          href={subPage.link}
                          sx={{ color: "gray", textTransform: "none" }}
                          underline="none"
                        >
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
