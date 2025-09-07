import React from 'react'
import { Grid, Stack, Typography, Box, Skeleton } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import api from '@/lib/api'
import BookCard from '@/components/books/BookCard.jsx'
import { useQuery } from '@tanstack/react-query'
import ErrorState from '@/components/common/ErrorState.jsx'

export default function Home() {
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['books', page],
    queryFn: async () => {
      const { data } = await api.get(`/book?page=${page}&limit=12`)
      return data
    },
  })

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>รายการหนังสือล่าสุด</Typography>
      </Box>
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item key={i} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton width="80%" sx={{ mt: 1 }} />
                <Skeleton width="60%" />
              </Grid>
            ))
          : isError ? (
            <Grid item xs={12}>
              <ErrorState onRetry={refetch} message="ไม่สามารถโหลดรายการหนังสือได้" />
            </Grid>
          ) : (data?.books || []).map((b) => (
              <Grid item key={b.id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
                <BookCard book={b} />
              </Grid>
            ))}
      </Grid>
      {/* Pagination intentionally hidden per request */}
    </Stack>
  )
}
