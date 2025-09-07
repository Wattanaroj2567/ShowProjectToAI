import React, { useState } from 'react'
import { AppBar, Avatar, Box, Button, Container, CssBaseline, Toolbar, Typography, Stack, CircularProgress } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Toaster } from 'react-hot-toast'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import theme from '@/theme'
import { useAuth } from '@/contexts/useAuth'
import { toApiAsset, resolveProfileImagePath } from '@/lib/url'
import { colorFromString, initialFromName } from '@/lib/avatar'
import { notifySuccess } from '@/lib/notify'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const authRoutes = new Set(['/login', '/register', '/forgot-password', '/reset-password'])
  const isAuthPage = authRoutes.has(pathname)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = () => {
    if (loggingOut) return
    setLoggingOut(true)
    // clear auth immediately; give small delay for UX
    logout()
    notifySuccess('ออกจากระบบแล้ว')
    setTimeout(() => {
      navigate('/')
      setLoggingOut(false)
    }, 600)
  }

  // Prepare header avatar/name if logged in
  const name = user ? (user.displayName || user.username || 'User') : null
  const resolved = user ? resolveProfileImagePath(user.profileImage) : null
  const avatarSrc = resolved ? toApiAsset(resolved) : undefined
  const avatarBg = user ? colorFromString(user.id || name) : undefined
  const initial = user ? initialFromName(user.displayName, user.username) : 'U'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right"
        toastOptions={{
          duration: 2500,
          style: { fontSize: 14 },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            Fiction Book Review
          </Typography>
          {!user && !isAuthPage && (
            <Button color="inherit" component={RouterLink} to="/login">เข้าสู่ระบบ</Button>
          )}
          {user && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack component={RouterLink} to="/profile" direction="row" spacing={1.2} alignItems="center" sx={{ color: 'inherit', textDecoration: 'none' }}>
                <Avatar alt={name || 'me'} src={avatarSrc} imgProps={{ referrerPolicy: 'no-referrer' }} sx={{ width: 32, height: 32, bgcolor: avatarBg }}>
                  {initial}
                </Avatar>
                <Typography variant="body2" noWrap sx={{ maxWidth: { xs: 100, sm: 160 }, fontWeight: 500 }}>
                  {name}
                </Typography>
              </Stack>
              <Button color="inherit" onClick={handleLogout} disabled={loggingOut} startIcon={loggingOut ? <CircularProgress size={16} color="inherit" /> : null}>
                {loggingOut ? 'กำลังออก...' : 'ออกจากระบบ'}
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ py: 3 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </ThemeProvider>
  )
}
