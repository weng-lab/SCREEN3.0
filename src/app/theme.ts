"use client";
import { createTheme } from "@mui/material/styles";
import type {} from "@weng-lab/ui-components"; // provides module augmentation to add DataGrid to theme

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
