"use client";
import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

type MenuContextType = {
  isMenuOpen: boolean;
  menuCanBeOpened: boolean;
  setMenuCanBeOpen: (value: boolean) => void;
  isMenuMounted: boolean;
  setIsMenuMounted: (value: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setMenuOpen: (value: boolean) => void; // optional full control
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

/**
 * Used to provide global handling of opening/closing the sidebar menu.
 * This is needed to allow the "New Search" button to open the sidebar
 * so that the search component can be focused
 */

export const MenuControlProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // MobileMenu controls this. Set to true only on mobile
  const [menuCanBeOpened, setMenuCanBeOpen] = useState(false);
  // MobileMenu controls this. Set to true by Drawer onEntered
  const [isMenuMounted, setIsMenuMounted] = useState(false);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  // Memoized so consumers only rerender when the menu state actually changes
  const value = useMemo(
    () => ({
      isMenuOpen,
      menuCanBeOpened,
      setMenuCanBeOpen,
      isMenuMounted,
      setIsMenuMounted,
      openMenu,
      closeMenu,
      toggleMenu,
      setMenuOpen: setIsMenuOpen,
    }),
    [isMenuOpen, menuCanBeOpened, isMenuMounted, openMenu, closeMenu, toggleMenu]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

/**
 * Used to provide global handling of opening/closing the sidebar menu.
 * This is needed to allow the "New Search" button to open the sidebar
 * so that the search component can be focused
 */
export const useMenuControl = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
