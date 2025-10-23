"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

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

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <MenuContext.Provider
      value={{
        isMenuOpen,
        menuCanBeOpened,
        setMenuCanBeOpen,
        isMenuMounted,
        setIsMenuMounted,
        openMenu,
        closeMenu,
        toggleMenu,
        setMenuOpen: setIsMenuOpen,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
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
