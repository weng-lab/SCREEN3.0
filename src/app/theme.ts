'use client'
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: "#0c184a",
      light: "#100e98",
      contrastText: "#FFFFFF"
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
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    }
  },
});