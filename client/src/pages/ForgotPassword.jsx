import React, { useState } from 'react'
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import api from '@/lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setMsg('ถ้ามีอีเมลนี้ในระบบ ระบบจะส่งลิงก์รีเซ็ตให้ทันที')
      setEmail('')
    } catch (err) {
      setMsg(err?.response?.data?.message || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 560 }}>
        <Stack spacing={2}>
          <Typography variant="h5">ลืมรหัสผ่าน</Typography>
          {msg && <Alert severity={msg.startsWith('ถ้า') ? 'info' : 'error'}>{msg}</Alert>}
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField label="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ alignSelf: 'center', px: 5, minWidth: 260 }}>ส่งลิงก์รีเซ็ต</Button>
            </Stack>
          </Box>
          <Divider flexItem sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ textAlign: 'left' }}>
            จำรหัสผ่านได้แล้ว? <Link component={RouterLink} to="/login">กลับไปเข้าสู่ระบบ</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
