import React, { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Button, Grid, Stack, Tab, Tabs, TextField, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Link } from '@mui/material'
import api from '@/lib/api'
import { toApiAsset, resolveProfileImagePath } from '@/lib/url'
import { useAuth } from '@/contexts/useAuth'
import { useNavigate } from 'react-router-dom'
import AutoWidthTextField, { measureCh } from '@/components/common/AutoWidthTextField.jsx'
import { notifySuccess, notifyError } from '@/lib/notify'

export default function Profile() {
  const { setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)
  // Local states per action
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' })
  const [emailMsg, setEmailMsg] = useState('')
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '' })
  const [pwdMsg, setPwdMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get('/user/profile')
        if (!cancelled) {
          const normalized = { ...data.data, profileImage: resolveProfileImagePath(data.data.profileImage) }
          setProfile(normalized)
          setDisplayName(data.data.displayName || '')
          setUsername(data.data.username || '')
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || 'โหลดโปรไฟล์ไม่สำเร็จ')
      }
    })()
    return () => { cancelled = true }
  }, [])

  async function saveDisplayName() {
    setSaving(true); setError('')
    try {
      const { data } = await api.put('/user/profile', { displayName })
      const updated = { ...profile, ...data.data, profileImage: resolveProfileImagePath(data.data?.profileImage || profile.profileImage) }
      setProfile(updated)
      setUser((u) => (u ? { ...u, displayName: updated.displayName } : u))
    } catch (err) {
      setError(err?.response?.data?.message || 'อัปเดตชื่อที่แสดงไม่สำเร็จ')
      notifyError(err?.response?.data?.message || 'อัปเดตชื่อที่แสดงไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function saveUsername() {
    setSaving(true); setError('')
    try {
      const { data } = await api.put('/user/profile', { username })
      const updated = { ...profile, ...data.data, profileImage: resolveProfileImagePath(data.data?.profileImage || profile.profileImage) }
      setProfile(updated)
      setUser((u) => (u ? { ...u, username: updated.username } : u))
    } catch (err) {
      setError(err?.response?.data?.message || 'อัปเดตชื่อผู้ใช้ไม่สำเร็จ')
      notifyError(err?.response?.data?.message || 'อัปเดตชื่อผู้ใช้ไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function saveAvatar() {
    if (!file) return
    setSaving(true); setError('')
    try {
      const fd = new FormData()
      fd.append('profileImage', file)
      const { data } = await api.put('/user/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const updated = { ...profile, ...data.data }
      setProfile(updated)
      setUser((u) => (u ? { ...u, profileImage: updated.profileImage } : u))
      setFile(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'อัปโหลดรูปไม่สำเร็จ')
      notifyError(err?.response?.data?.message || 'อัปโหลดรูปไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <Typography>กำลังโหลด...</Typography>

  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h5">โปรไฟล์ของฉัน</Typography>
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={active}
              onChange={(_, v) => setActive(v)}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="ชื่อที่แสดง" />
              <Tab label="ชื่อผู้ใช้" sx={{ display: profile?.isGoogleUser ? 'none' : undefined }} />
              <Tab label={profile?.isGoogleUser ? 'การเชื่อมต่อ' : 'อีเมล'} />
              <Tab label="รหัสผ่าน" sx={{ display: (profile?.isGoogleUser || !profile?.hasLocalPassword) ? 'none' : undefined }} />
              <Tab label="รูปโปรไฟล์" />
              <Tab label="ลบบัญชี" />
            </Tabs>
          </Grid>

          <Grid item xs={12} md={9}>
            {/* Display Name */}
            {active === 0 && (
              <Stack spacing={2} maxWidth={520}>
                <TextField label="ชื่อที่แสดง" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth />
                <Button variant="contained" size="large" disabled={saving} onClick={saveDisplayName} fullWidth>บันทึก</Button>
              </Stack>
            )}

            {/* Username */}
            {active === 1 && (
              <Stack spacing={2} maxWidth={520}>
                <TextField label="ชื่อผู้ใช้" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
                <Button variant="contained" size="large" disabled={saving} onClick={saveUsername} fullWidth>บันทึก</Button>
              </Stack>
            )}

            {/* Email */}
            {active === 2 && (
              <Stack spacing={2}>
                {profile?.isGoogleUser ? (
                  <>
                    <Alert severity="info">บัญชีนี้เชื่อมต่อกับ Google แล้ว ({profile.email})</Alert>
                    <Typography variant="body2" color="text.secondary">
                      จัดการการเข้าถึงได้ที่ Google Account ของคุณ:
                      {' '}
                      <Link href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer">
                        https://myaccount.google.com/connections
                      </Link>
                    </Typography>
                  </>
                ) : (
                  <>
                    {emailMsg && <Alert severity={emailMsg.startsWith('สำเร็จ') ? 'success' : 'error'}>{emailMsg}</Alert>}
                    {/** คำนวณความกว้างจากอีเมลปัจจุบัน แล้วล็อกให้ช่องถัดไปใช้ความกว้างเดียวกัน */}
                    {(() => {
                      const widthCh = measureCh(profile.email || '', { min: 16, max: 60, pad: 2 })
                      return (
                        <>
                          <AutoWidthTextField label="อีเมลปัจจุบัน" value={profile.email || ''} disabled widthCh={widthCh} />
                          <AutoWidthTextField label="อีเมลใหม่" type="email" value={emailForm.newEmail} onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} widthCh={widthCh} />
                          <TextField label="รหัสผ่านปัจจุบัน" type="password" value={emailForm.password} onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} sx={{ width: `${widthCh}ch`, maxWidth: '100%' }} />
                          <Button variant="contained" size="large" disabled={saving} fullWidth onClick={async () => {
                            setEmailMsg('')
                            setSaving(true)
                            try {
                              const { data } = await api.put('/user/email', { newEmail: emailForm.newEmail, password: emailForm.password })
                              setEmailMsg('สำเร็จ: ' + (data?.message || 'เปลี่ยนอีเมลสำเร็จ'))
                              setProfile((p) => ({ ...p, email: emailForm.newEmail }))
                              setEmailForm({ newEmail: '', password: '' })
                              notifySuccess('เปลี่ยนอีเมลสำเร็จ')
                            } catch (err) {
                              setEmailMsg(err?.response?.data?.message || 'เปลี่ยนอีเมลไม่สำเร็จ')
                              notifyError(err?.response?.data?.message || 'เปลี่ยนอีเมลไม่สำเร็จ')
                            } finally {
                              setSaving(false)
                            }
                          }}>บันทึกอีเมลใหม่</Button>
                        </>
                      )
                    })()}
                  </>
                )}
              </Stack>
            )}

            {/* Password */}
            {active === 3 && (
              <Stack spacing={2} maxWidth={520}>
                {pwdMsg && <Alert severity={pwdMsg.startsWith('สำเร็จ') ? 'success' : 'error'}>{pwdMsg}</Alert>}
                <TextField label="รหัสผ่านเดิม" type="password" value={pwdForm.oldPassword} onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })} fullWidth />
                <TextField label="รหัสผ่านใหม่" type="password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} fullWidth />
                <Button variant="contained" size="large" disabled={saving} fullWidth onClick={async () => {
                  setPwdMsg('')
                  setSaving(true)
                  try {
                    const { data } = await api.put('/user/password', { oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword })
                    setPwdMsg(data?.message || 'สำเร็จ: เปลี่ยนรหัสผ่านสำเร็จ')
                    setPwdForm({ oldPassword: '', newPassword: '' })
                    notifySuccess('เปลี่ยนรหัสผ่านสำเร็จ')
                  } catch (err) {
                    setPwdMsg(err?.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
                    notifyError(err?.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ')
                  } finally {
                    setSaving(false)
                  }
                }}>บันทึกรหัสผ่านใหม่</Button>
              </Stack>
            )}

            {/* Avatar */}
            {active === 4 && (
              <Stack spacing={2} maxWidth={520}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar src={toApiAsset(resolveProfileImagePath(profile.profileImage))} alt={profile.username} sx={{ width: 80, height: 80 }} />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Button variant="outlined" component="label">
                      เลือกรูปโปรไฟล์
                      <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </Button>
                    {file && <Typography variant="body2" sx={{ mt: 1 }}>ไฟล์ที่เลือก: {file.name}</Typography>}
                  </Grid>
                </Grid>
                {file && (
                  <Button variant="contained" size="large" disabled={saving} onClick={async () => { await saveAvatar(); notifySuccess('บันทึกรูปโปรไฟล์ใหม่แล้ว') }} fullWidth>บันทึกรูปใหม่</Button>
                )}
                <Divider />
                <Typography variant="body2" color="text.secondary">
                  รองรับไฟล์ .jpg .jpeg .png .webp ขนาดไม่เกิน 3MB
                </Typography>
              </Stack>
            )}

            {/* Delete Account */}
            {active === 5 && (
              <DeleteAccountSection onDeleted={() => { logout(); navigate('/'); }} />
            )}
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

function DeleteAccountSection({ onDeleted }) {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    setMsg('')
    try {
      await api.delete('/auth/account')
      if (onDeleted) onDeleted()
    } catch (err) {
      setMsg(err?.response?.data?.message || 'ลบบัญชีไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack spacing={2} maxWidth={520}>
      {msg && <Alert severity="error">{msg}</Alert>}
      <Typography variant="h6" color="error">ลบบัญชีผู้ใช้</Typography>
      <Typography color="text.secondary">
        คำเตือน: การลบบัญชีจะเป็นการลบข้อมูลผู้ใช้และรีวิวทั้งหมดอย่างถาวร ไม่สามารถกู้คืนได้
      </Typography>
      <Button variant="contained" size="large" color="error" onClick={() => setOpen(true)} fullWidth>ลบบัญชี</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>ยืนยันการลบบัญชี</DialogTitle>
        <DialogContent>
          <DialogContentText>
            การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากต้องการยืนยัน ให้พิมพ์คำว่า DELETE แล้วกดปุ่มยืนยัน
          </DialogContentText>
          <TextField autoFocus margin="dense" label="พิมพ์ DELETE เพื่อยืนยัน" fullWidth value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" color="error" disabled={confirm !== 'DELETE' || loading} onClick={() => { notifySuccess('ลบบัญชีสำเร็จ'); handleDelete(); }}>ยืนยันลบ</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
