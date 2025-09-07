import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Pagination, Stack, Divider, Button, Collapse } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/contexts/useAuth';
import ReviewItem from './ReviewItem';
import CreateReviewForm from './CreateReviewForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorState from '@/components/common/ErrorState.jsx'

export default function ReviewList({ bookId }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  // pagination total handled from API response
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reviews', bookId, page],
    queryFn: async () => {
      const { data } = await api.get(`/review/books/${bookId}/reviews?page=${page}&limit=5`);
      return data.data
    },
    keepPreviousData: true,
  })

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleReviewAction = (evt) => {
    if (evt?.created) setPage(1);
    queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
    queryClient.invalidateQueries({ queryKey: ['book', String(bookId)] });
    setShowCreate(false);
  };

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || {};
  const userReview = reviews.find(r => r.User.id === user?.id);
  const canUserReview = user && !userReview;
  const hasReviews = reviews.length > 0;

  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h5">รีวิวทั้งหมด {reviews?.length ? `(${reviews.length})` : ''}</Typography>
        {/* Right header actions */}
        {canUserReview && hasReviews ? (
          !showCreate ? (
            <Button size="small" variant="contained" color="primary" onClick={() => setShowCreate(true)} sx={{ boxShadow: 2 }}>
              แสดงความคิดเห็น
            </Button>
          ) : null
        ) : !user ? (
          <Button size="small" component={RouterLink} to="/login" variant="outlined">เข้าสู่ระบบเพื่อแสดงความคิดเห็น</Button>
        ) : null}
      </Stack>
      <Divider sx={{ mb: 2, pointerEvents: 'none' }} />

      {/* New review entry point */}
      <Collapse in={showCreate} unmountOnExit timeout={200}>
        {showCreate && (
          <CreateReviewForm
            bookId={bookId}
            onReviewSubmitted={handleReviewAction}
            onCancel={() => setShowCreate(false)}
          />
        )}
      </Collapse>

      {/* Display reviews */}
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <ErrorState message="ไม่สามารถโหลดรีวิวได้" onRetry={refetch} />
      ) : reviews.length === 0 ? (
        <Stack alignItems="center" spacing={1} sx={{ color: 'text.secondary' }}>
          <Typography>ยังไม่มีรีวิวสำหรับหนังสือเล่มนี้</Typography>
          {canUserReview && (
            <Button variant="contained" color="primary" onClick={() => setShowCreate(true)}>มาเป็นคนแรกที่แสดงความคิดเห็น!</Button>
          )}
        </Stack>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onReviewDeleted={handleReviewAction}
              onReviewUpdated={handleReviewAction}
            />
          ))}
          {(pagination.totalPages || 1) > 1 && (
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={pagination.totalPages || 1}
                page={pagination.currentPage || page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
