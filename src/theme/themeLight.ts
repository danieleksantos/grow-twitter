import { createTheme } from '@mui/material'

export const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d9bf0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0f1419',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f1419',
      secondary: '#536471',
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
          borderBottom: '1px solid #eff3f4',
        },
      },
    },
  },
})
