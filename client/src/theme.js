import { createTheme } from '@mui/material/styles'

const primaryGradient = 'linear-gradient(90deg, #6b2fad 0%, #7e3bb0 50%, #8e44ad 100%)'

// A refined, book-inspired theme: royal violet + coral accent
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6b2fad' }, // Royal violet
    secondary: { main: '#ff6f61' }, // Coral accent
    background: {
      default: '#f8f5f0', // Paper-like background
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #6b2fad 0%, #8e44ad 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 12,
          boxShadow: '0 4px 10px rgba(107,47,173,0.2)',
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            backgroundImage: primaryGradient,
          }),
          ...(ownerState.variant === 'contained' && ownerState.disabled && (ownerState.color === 'primary' || !ownerState.color) && {
            backgroundImage: primaryGradient,
            color: '#fff',
            opacity: 0.6,
            boxShadow: 'none',
            filter: 'saturate(85%)',
          }),
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
        rounded: { borderRadius: 16 },
      },
    },
  },
})

export default theme
