import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14E2BA', // Westchester Angels teal
      light: '#4DFFDB',
      dark: '#00B093',
      contrastText: '#fff',
    },
    secondary: {
      main: '#3F3F3F', // Dark gray for contrast
      light: '#666666',
      dark: '#2A2A2A',
      contrastText: '#fff',
    },
    success: {
      main: '#14E2BA',
    },
    error: {
      main: '#e00',
    },
    background: {
      default: '#F9F9F9', // Light gray background
      paper: '#FFFFFF', // White cards/paper
    },
    text: {
      primary: '#666666', // Dark text
      secondary: '#A5A5A5', // Light text
    },
    divider: '#F4F4F4', // Light gray for dividers
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
})

export default theme

