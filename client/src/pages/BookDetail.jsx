import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Stack, Typography, Divider, Rating } from '@mui/material';
import api from '../lib/api';
import { toApiAsset } from '@/lib/url';
import ReviewList from '@/components/reviews/ReviewList'; // Import the new component
import { useQuery } from '@tanstack/react-query';
import ErrorState from '@/components/common/ErrorState.jsx'

export default function BookDetail() {
  const { id } = useParams();
  const { data: book, isLoading, isError, refetch } = useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data } = await api.get(`/book/${id}`)
      return data
    },
  })

  if (isLoading) return <Typography>กำลังโหลด...</Typography>;
  if (isError) return <ErrorState message="ไม่พบหนังสือ หรือโหลดข้อมูลไม่สำเร็จ" onRetry={refetch} />;

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {book.coverImageUrl && (
          <Box sx={{ maxWidth: 360, width: '100%', flexShrink: 0 }}>
            <img
              src={toApiAsset(book.coverImageUrl)}
              alt={book.title}
              style={{ width: '100%', borderRadius: 8, display: 'block' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </Box>
        )}
        <Stack spacing={1}>
          <Typography variant="h4" component="h1" fontWeight="bold">{book.title}</Typography>
          <Typography variant="h6" color="text.secondary">{book.author}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating value={Number(book.avgRating) || 0} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">({book.reviewCount || 0})</Typography>
          </Stack>
          {book.publishedYear && <Chip label={`ปีที่พิมพ์ ${book.publishedYear}`} sx={{ width: 'fit-content' }} />}
          {book.description && (
            <Typography sx={{ mt: 2 }} color="text.secondary" paragraph>
              {book.description}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Integrate the ReviewList component */}
      <Divider sx={{ my: 4, pointerEvents: 'none' }} />
      <ReviewList bookId={id} />
    </>
  );
}
