import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Chip, Stack, Typography } from '@mui/material'
import api from '../lib/api'
import { toApiAsset } from '@/lib/url'

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get(`/book/${id}`)
        if (!cancelled) setBook(data)
      } catch {
        if (!cancelled) setBook(undefined)
      }
    })()
    return () => { cancelled = true }
  }, [id])

  if (book === undefined) return <Typography>ไม่พบหนังสือ</Typography>
  if (!book) return <Typography>กำลังโหลด...</Typography>

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      {book.coverImageUrl && (
        <Box sx={{ maxWidth: 360 }}>
          <img src={toApiAsset(book.coverImageUrl)} alt={book.title} style={{ width: '100%', borderRadius: 8 }} onError={(e) => (e.currentTarget.style.display = 'none')} />
        </Box>
      )}
      <Stack spacing={1}>
        <Typography variant="h5">{book.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{book.author}</Typography>
        {book.publishedYear && <Chip label={`ปีที่พิมพ์ ${book.publishedYear}`} />}
        {book.description && (
          <Typography sx={{ mt: 2 }} color="text.secondary">{book.description}</Typography>
        )}
      </Stack>
    </Stack>
  )
}
