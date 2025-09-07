import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

export default function ErrorState({ message = 'ขออภัย เกิดข้อผิดพลาด', onRetry }) {
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="h6">😵‍💫 Oops!</Typography>
        <Typography color="text.secondary">{message}</Typography>
        {onRetry && (
          <Button variant="outlined" onClick={onRetry}>ลองอีกครั้ง</Button>
        )}
      </Stack>
    </Box>
  )}

