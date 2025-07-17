import { Launch } from "@mui/icons-material";
import {  Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import NextLink, { LinkProps as NextLinkProps } from "next/link"

//Combines the props of Next Link and Mui Link, adds the custom props
export type LinkComponentProps = Omit<MuiLinkProps, "component" | "href"> &
  Omit<NextLinkProps, "passHref"> & {
    showExternalIcon?: boolean;
    openInNewTab?: boolean;
  };

/**
 * Mui Link styled component, Next Link behavior
 * @param props ```MuiLinkProps & { showExternalIcon?: boolean }```
 * @returns 
 */
export const LinkComponent = ({
  showExternalIcon,
  openInNewTab = false,
  children,
  ...rest
}: LinkComponentProps) => {
  return (
    <MuiLink
      component={NextLink}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      target={openInNewTab ? "_blank" : undefined}
      {...rest}
    >
      {children}
      {showExternalIcon && (
        <Launch sx={{ display: "inline-flex", verticalAlign: "middle", ml: 0.5 }} color="inherit" fontSize="inherit" />
      )}
    </MuiLink>
  );
};