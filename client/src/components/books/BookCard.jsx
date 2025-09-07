import React from 'react'
import { Card, CardActionArea, CardContent, Stack, Typography, Box, Rating } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { toApiAsset } from '@/lib/url'

export default function BookCard({ book }) {
  const img = toApiAsset(book.coverImageUrl)
  // Image only; remove "ใหม่" badge for a cleaner look

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }} elevation={2}>
      <CardActionArea component={RouterLink} to={`/book/${book.id}`} sx={{ display: 'block', height: '100%' }}>
        <Box sx={{ position: 'relative', p: 1 }}>
          <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 200, bgcolor: '#eee' }}>
            <img src={img} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
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
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Rating size="small" value={Number(book.avgRating) || 0} precision={0.1} readOnly />
              <Typography variant="caption" color="text.secondary">({book.reviewCount || 0})</Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">E-Books</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
