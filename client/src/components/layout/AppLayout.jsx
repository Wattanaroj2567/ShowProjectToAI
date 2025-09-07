import React from 'react'
import { AppBar, Avatar, Box, Button, Container, CssBaseline, Toolbar, Typography, Stack } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import theme from '@/theme'
import { useAuth } from '@/contexts/useAuth'
import { toApiAsset, resolveProfileImagePath } from '@/lib/url'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const authRoutes = new Set(['/login', '/register', '/forgot-password', '/reset-password'])
  const isAuthPage = authRoutes.has(pathname)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <Avatar
                component={RouterLink}
                to="/profile"
                alt={user?.username || 'me'}
                src={toApiAsset(resolveProfileImagePath(user?.profileImage))}
                sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
              >
                {(user?.displayName || user?.username || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Button color="inherit" onClick={handleLogout}>ออกจากระบบ</Button>
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
