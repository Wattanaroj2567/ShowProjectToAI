import React, { useEffect, useState } from 'react'
import { Grid, Pagination, Stack, Typography, Box, Skeleton } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import api from '@/lib/api'
import BookCard from '@/components/books/BookCard.jsx'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/book?page=${page}&limit=12`)
        if (!cancelled) {
          setBooks(data.books || [])
          setTotalPages(data.totalPages || 1)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [page])

  const handleChange = (_, value) => {
    setSearchParams({ page: value.toString() })
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>รายการหนังสือล่าสุด</Typography>
      </Box>
      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item key={i} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
                <Skeleton width="80%" sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))
          : books.map((b) => (
              <Grid item key={b.id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                <BookCard book={b} />
              </Grid>
            ))}
      </Grid>
      <Stack alignItems="center">
        <Pagination color="primary" page={page} count={totalPages} onChange={handleChange} />
      </Stack>
    </Stack>
  )
}
