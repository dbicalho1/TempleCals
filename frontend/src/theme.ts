import { createTheme, PaletteMode } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material';

const globalStyles = {
  '& .MuiButtonBase-root': {
    '&:focus': {
      outline: 'none !important',
    },
    '&.Mui-focusVisible': {
      outline: '2px solid #800000 !important',
      outlineOffset: '2px !important',
    },
  },
  '& .MuiIconButton-root': {
    '&:focus': {
      outline: 'none !important',
      backgroundColor: 'rgba(128, 0, 0, 0.04) !important',
    },
    '&:hover': {
      backgroundColor: 'rgba(128, 0, 0, 0.08) !important',
    },
    '&.Mui-focusVisible': {
      outline: '2px solid #800000 !important',
      outlineOffset: '2px !important',
    },
  },
};

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#9D2235',
      light: '#FF8A8F',
      dark: '#E03A3E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#424242',
      light: '#6D6D6D',
      dark: '#1B1B1B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFA000',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
    text: {
      primary: mode === 'light' ? '#212121' : '#FFFFFF',
      secondary: mode === 'light' ? '#616161' : '#AAAAAA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globalStyles,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#9D2235' : '#1E1E1E',
          boxShadow: mode === 'light' ? '0 2px 10px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid #800000',
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#711927',
            boxShadow: '0 4px 12px rgba(255, 90, 95, 0.2)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(128, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.05)' : '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: 12,
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
        },
        elevation1: {
          boxShadow: mode === 'light' ? '0 2px 12px rgba(0, 0, 0, 0.05)' : '0 2px 12px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: mode === 'light' ? '0 4px 16px rgba(0, 0, 0, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
        },
      },
    },
  },
});

const lightTheme = createTheme(getThemeOptions('light'));
const darkTheme = createTheme(getThemeOptions('dark'));

export { lightTheme, darkTheme };
