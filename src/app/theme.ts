"use client";
import { createTheme } from "@mui/material/styles";
import type {} from "@weng-lab/ui-components";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0c184a",
      light: "#100e98",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00063D",
      light: "#e4ebff",
    },
  },
  components: {
    //This came with file, not sure what it does
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    // temporary fix until we setup all tables to properly handle row grouping
    // note: row aggregation and pivoting are currently disabled by default directly in the <Table /> component since we have no clear use case
    MuiDataGrid: {
      defaultProps: {
        disableRowGrouping: true,
      },
    },
  },
});
