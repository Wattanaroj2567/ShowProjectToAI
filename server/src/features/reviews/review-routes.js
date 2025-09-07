const express = require('express');
const router = express.Router();
const { authenticate } = require('../auth/auth-middleware');
const reviewController = require('./review-controller');

router.post('/books/:bookId/reviews', authenticate, reviewController.createReview);
router.get('/books/:bookId/reviews', reviewController.getBookReviews);
router.get('/users/:userId/reviews', reviewController.getUserReviews);
router.put('/:reviewId', authenticate, reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;
