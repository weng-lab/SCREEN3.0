"use client";
import { AppBar, Box, Toolbar, IconButton, Stack } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Search } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useMenuControl } from "common/components/MenuContext";
import { useScrollToSearch } from "common/hooks/ui";
import { Assembly } from "common/types/globalTypes";
import MobileMenu from "./MobileMenu";
import MaintenanceBanner from "./MaintenanceBanner";
import NewVersionBanner from "./NewVersionBanner";
import DesktopNav from "./DesktopNav";
import AssemblySelect from "./AssemblySelect";
import HeaderSearch from "./HeaderSearch";
import { pageLinks } from "./navLinks";

type ResponsiveAppBarProps = {
  maintenance?: boolean;
};

function Header({ maintenance }: ResponsiveAppBarProps) {
  const { openMenu } = useMenuControl();
  const pathname = usePathname();
  const handleFocusSearch = useScrollToSearch();

  // Owned here so the desktop selector and the mobile drawer stay in sync
  const [assembly, setAssembly] = useState<Assembly>("GRCh38");

  const isHomePage = pathname === "/";

  return (
    <AppBar sx={{ position: "sticky", top: 0 }}>
      {maintenance && <MaintenanceBanner />}
      <Toolbar sx={{ justifyContent: "space-between", backgroundColor: "primary.main" }}>
        <Stack direction={"row"} spacing={1}>
          <Box component={Link} href={"/"} height={45} width={110}>
            <Image
              priority
              src="/on-dark@16x.png"
              width={110}
              height={45}
              alt="SCREEN logo"
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </Box>
          <DesktopNav pageLinks={pageLinks} />
        </Stack>
        {isHomePage ? (
          <IconButton sx={{ color: "white", display: { xs: "none", md: "flex" } }} onClick={handleFocusSearch}>
            <Search />
          </IconButton>
        ) : (
          <Stack direction={"row"} spacing={2} alignItems={"center"} sx={{ display: { xs: "none", md: "flex" } }}>
            <AssemblySelect assembly={assembly} onAssemblyChange={setAssembly} />
            <HeaderSearch id="desktop-search-component" variant="desktop" assembly={assembly} />
          </Stack>
        )}
        {/* mobile view */}
        <Box display={{ xs: "flex", md: "none" }} alignItems={"center"} gap={2}>
          <IconButton size="large" onClick={openMenu} color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>
        <MobileMenu pageLinks={pageLinks} assembly={assembly} onAssemblyChange={setAssembly} />
      </Toolbar>
      {isHomePage && process.env.NEXT_PUBLIC_SHOW_RELEASE_BANNER === "true" && <NewVersionBanner />}
    </AppBar>
  );
}
export default Header;
