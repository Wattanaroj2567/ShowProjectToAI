import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../contexts/useAuth'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
import { API_BASE_URL } from '../lib/url'

export default function Login() {
  const { login, loading, loginWithGoogleToken } = useAuth()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token') || ''
    const userStr = params.get('user') || ''
    const redirectedFrom = params.get('from') || ''

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        loginWithGoogleToken(token, user)
        navigate(redirectedFrom || from, { replace: true })
      } catch {
        setError('เกิดข้อผิดพลาดในการล็อกอินด้วย Google')
      }
    }
  }, [location, loginWithGoogleToken, navigate, from])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login({ emailOrUsername, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  const handleGoogleLogin = () => {
    const state = encodeURIComponent(from);
    window.location.href = `${API_BASE_URL}/auth/google?state=${state}`;
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" gutterBottom>เข้าสู่ระบบ</Typography>
              <Typography variant="body2" color="text.secondary">ยินดีต้อนรับกลับสู่ Fiction Book Review</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="อีเมลหรือชื่อผู้ใช้" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required fullWidth />
            <TextField label="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1, alignSelf: 'center', px: 5, minWidth: 260 }}>เข้าสู่ระบบ</Button>
            <Divider flexItem>หรือ</Divider>
            <Button variant="outlined" onClick={handleGoogleLogin} sx={{ alignSelf: 'center', minWidth: 260 }}>
              เข้าสู่ระบบด้วย Google
            </Button>
            <Divider flexItem sx={{ my: 1 }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={1}
              sx={{ width: '100%' }}
            >
              <Typography variant="body2">ลืมรหัสผ่าน? <Link component={RouterLink} to="/forgot-password">กดที่นี่</Link></Typography>
              <Typography variant="body2">ยังไม่มีบัญชี? <Link component={RouterLink} to="/register">สมัครสมาชิก</Link></Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
