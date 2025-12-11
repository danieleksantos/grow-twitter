import { createTheme } from '@mui/material'

export const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1d9bf0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#eff3f4',
      contrastText: '#0f1419',
    },
    background: {
      default: '#000000',
      paper: '#16181c',
    },
    text: {
      primary: '#e7e9ea',
      secondary: '#71767b',
    },
    error: {
      main: '#f4212e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 9999,
          fontWeight: 700,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #2f3336',
        },
      },
    },
  },
})
