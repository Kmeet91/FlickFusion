import express from 'express';
import { getReviewsForMedia, addReview } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/reviews/:mediaType/:mediaId
router.get('/:mediaType/:mediaId', getReviewsForMedia);

// @route   POST api/reviews
// This is a protected route, so only logged-in users can post reviews
router.post('/', authMiddleware, addReview);

export default router;