import { createTheme } from '@mui/material/styles'

// Softer, balanced palette: pastel violet primary + warm coral accent
const primaryMain = '#6e56cf'
const primaryGradient = 'linear-gradient(90deg, #6e56cf 0%, #8a6cf7 100%)'
const secondaryMain = '#ff8a65'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: primaryMain, light: '#8a78e0', dark: '#5b46b0' },
    secondary: { main: secondaryMain, light: '#ffa488', dark: '#ef6c48' },
    background: {
      default: '#f6f3ee',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    divider: '#e9e3da',
  },
  shape: { borderRadius: 14 },
  typography: {
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarGutter: 'stable both-edges',
          height: '100%'
        },
        body: {
          minHeight: '100%',
          overflowY: 'scroll',
          scrollbarGutter: 'stable both-edges',
          backgroundColor: '#f6f3ee',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #6e56cf 0%, #835de6 100%)',
          boxShadow: '0 2px 8px rgba(110,86,207,0.25)'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(110,86,207,0.18)',
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && ({
            backgroundImage: primaryGradient,
          })),
          ...(ownerState.variant === 'contained' && ownerState.color === 'secondary' && ({
            backgroundColor: secondaryMain,
            color: '#fff',
            '&:hover': { backgroundColor: '#ff7a57' },
          })),
          ...(ownerState.variant === 'contained' && ownerState.disabled && ({
            boxShadow: 'none',
            opacity: 0.6,
            filter: 'saturate(85%)',
          })),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: { borderRadius: 16 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#e9e3da' },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: { color: '#f5b84b' },
      },
    },
  },
})

export default theme
