import React from 'react'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { toApiAsset } from '@/lib/url'

export default function BookCard({ book }) {
  const img = toApiAsset(book.coverImageUrl)
  const year = Number(book.publishedYear)
  const now = new Date().getFullYear()
  const isNew = Number.isFinite(year) && year >= now - 1

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }} elevation={2}>
      <CardActionArea component={RouterLink} to={`/book/${book.id}`} sx={{ display: 'block', height: '100%' }}>
        <Box sx={{ position: 'relative', p: 1 }}>
          <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', aspectRatio: '3/4', bgcolor: '#eee' }}>
            <img src={img} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
            {isNew && (
              <Chip label="ใหม่" color="secondary" size="small" sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 700 }} />
            )}
          </Box>
        </Box>
        <CardContent sx={{ pt: 0, pb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600} noWrap title={book.title}>
              {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap title={book.author}>
              {book.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">E-Books</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
