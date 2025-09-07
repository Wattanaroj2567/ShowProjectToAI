import React, { useState } from 'react'
import { Alert, Box, Button, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { useAuth } from '../contexts/useAuth'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { notifySuccess, notifyError } from '@/lib/notify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/schemas'

export default function Register() {
  const { register, loading } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', displayName: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (form) => {
    setError('')
    setSuccess(false)
    try {
      await register(form)
      setSuccess(true)
      notifySuccess('สมัครสมาชิกสำเร็จ!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ')
      notifyError(err?.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ')
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '70vh', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" gutterBottom>สมัครสมาชิก</Typography>
              <Typography variant="body2" color="text.secondary">สร้างบัญชีใหม่เพื่อเริ่มเขียนรีวิว</Typography>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">สมัครสมาชิกสำเร็จ! กำลังนำคุณไปหน้าล็อกอิน...</Alert>}
            <TextField label="ชื่อผู้ใช้"
              {...reg('username', {
                setValueAs: (v) => (v ?? '').replace(/[^A-Za-z0-9_]/g, ''),
              })}
              inputProps={{ inputMode: 'text', pattern: '[A-Za-z][A-Za-z0-9_]*' }}
              error={!!errors.username}
              helperText={errors.username?.message || 'ใช้ A-Z a-z 0-9 และ _ เริ่มด้วยตัวอักษร'}
              fullWidth
            />
            <TextField label="ชื่อที่แสดง" {...reg('displayName')} error={!!errors.displayName} helperText={errors.displayName?.message} fullWidth />
            <TextField label="อีเมล" type="email" {...reg('email')} error={!!errors.email} helperText={errors.email?.message} fullWidth />
            <TextField label="รหัสผ่าน" type="password" {...reg('password')} error={!!errors.password} helperText={errors.password?.message} fullWidth />
            <TextField label="ยืนยันรหัสผ่าน" type="password" {...reg('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} fullWidth />
            <Button type="submit" variant="contained" size="large" disabled={loading || isSubmitting} fullWidth sx={{ mt: 1 }}>สมัครสมาชิก</Button>
            <Divider flexItem sx={{ my: 1 }} />
            <Typography variant="body2" align="center">มีบัญชีอยู่แล้ว? <Link component={RouterLink} to="/login">เข้าสู่ระบบที่นี่</Link></Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
