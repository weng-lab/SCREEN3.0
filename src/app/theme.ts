'use client'
import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#494d6b",
      contrastText: "#FFFFFF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    //Since we are providing a default elevation of 0 to Paper, need to add elevation back to the Popper's Paper
    MuiAutocomplete: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 3
          }
        }
      }
    },
    MuiLink: {
      defaultProps: {
        underline: "hover"
      }
    }
  }
})
