"use client";
import { ThemeProvider, GlobalStyles } from "@mui/material";
import { theme } from "app/theme";
import { ReactNode } from "react";

export default function Theme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={(theme) => ({
          html: {
            backgroundColor: theme.palette.primary.main,
          },
        })}
      />
      {children}
    </ThemeProvider>
  );
}
