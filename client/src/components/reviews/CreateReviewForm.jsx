import React, { useEffect } from "react"
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Stack,
} from "@mui/material"
import api from "@/lib/api"
import { notifySuccess, notifyError } from "@/lib/notify"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reviewSchema } from "@/lib/schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function CreateReviewForm({
  bookId,
  existingReview,
  onReviewSubmitted,
  onCancel,
}) {
  const isEditing = !!existingReview
  const queryClient = useQueryClient()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, content: "" },
  })

  useEffect(() => {
    if (isEditing) {
      reset({
        rating: existingReview.rating || 0,
        content: existingReview.content || "",
      })
    }
  }, [existingReview, isEditing, reset])

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (isEditing) return api.put(`/review/${existingReview.id}`, payload)
      return api.post(`/review/books/${bookId}/reviews`, payload)
    },
    onSuccess: async () => {
      // Refresh review list and book summary (rating/count)
      await queryClient.invalidateQueries({ queryKey: ["reviews", bookId] })
      await queryClient.refetchQueries({ queryKey: ["reviews", bookId] })
      await queryClient.invalidateQueries({
        queryKey: ["book", String(bookId)],
      })
      if (onReviewSubmitted) onReviewSubmitted({ created: !isEditing })
      notifySuccess(isEditing ? "บันทึกการแก้ไขแล้ว" : "ส่งรีวิวเรียบร้อยแล้ว")
      if (!isEditing) {
        reset({ rating: 0, content: "" })
        if (onCancel) onCancel()
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "เกิดข้อผิดพลาดในการส่งรีวิว"
      notifyError(msg)
    },
  })

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      sx={{
        mt: 2,
        mb: 2,
        p: 2.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">
          {isEditing ? "แก้ไขรีวิวของคุณ" : "เขียนรีวิว"}
        </Typography>
        <Box>
          <Typography
            component="legend"
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            ให้คะแนน
          </Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Rating
                name="rating"
                value={value}
                onChange={(_, v) => onChange(v || 0)}
              />
            )}
          />
          {errors.rating && (
            <Typography variant="caption" color="error">
              {errors.rating.message}
            </Typography>
          )}
        </Box>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              label="เนื้อหารีวิว (ไม่บังคับ)"
              multiline
              rows={4}
              fullWidth
              {...field}
              error={!!errors.content}
              helperText={errors.content?.message}
            />
          )}
        />
        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || mutation.isPending}
            sx={{ alignSelf: "flex-start" }}
          >
            {isEditing ? "บันทึกการแก้ไข" : "ส่งรีวิว"}
          </Button>
          {!isEditing && onCancel && (
            <Button
              type="button"
              variant="text"
              color="inherit"
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
          )}
        </Stack>
      </Stack>
      {/* Success message handled by toast */}
    </Box>
  )
}
