import React, { useState } from 'react'
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../contexts/useAuth'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

export default function Register() {
  const { register, loading } = useAuth()
  const [form, setForm] = useState({ username: '', displayName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (form.password !== form.confirmPassword) {
      return setError('รหัสผ่านไม่ตรงกัน')
    }
    try {
      await register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ')
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" gutterBottom>สมัครสมาชิก</Typography>
              <Typography variant="body2" color="text.secondary">สร้างบัญชีใหม่เพื่อเริ่มเขียนรีวิว</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">สมัครสมาชิกสำเร็จ! กำลังนำคุณไปหน้าล็อกอิน...</Alert>}
            <TextField label="ชื่อผู้ใช้" name="username" value={form.username} onChange={handleChange} required fullWidth />
            <TextField label="ชื่อที่แสดง" name="displayName" value={form.displayName} onChange={handleChange} required fullWidth />
            <TextField label="อีเมล" type="email" name="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField label="รหัสผ่าน" type="password" name="password" value={form.password} onChange={handleChange} required fullWidth />
            <TextField label="ยืนยันรหัสผ่าน" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1, alignSelf: 'center', px: 5, minWidth: 260 }}>สมัครสมาชิก</Button>
            <Divider flexItem sx={{ my: 1 }} />
            <Typography variant="body2" align="center">มีบัญชีอยู่แล้ว? <Link component={RouterLink} to="/login">เข้าสู่ระบบที่นี่</Link></Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
