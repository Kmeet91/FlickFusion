import express from 'express';
import { getCurrentUser, addToWatchlist, removeFromWatchlist, addToHistory, removeFromHistory, getRecommendations } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateProfile, /* other imports */ } from '../controllers/userController.js';
import upload from '../middleware/upload.js'; // Import upload middleware

const router = express.Router();

// Apply the middleware to all these routes
router.use(authMiddleware);

// @route   GET api/users/me
// @desc    Get current user data
router.get('/me', getCurrentUser);

// @route   POST api/users/watchlist
// @desc    Add movie to watchlist
router.post('/watchlist', addToWatchlist);

// @route   DELETE api/users/watchlist/:movieId
// @desc    Remove movie from watchlist
router.delete('/watchlist/:movieId', removeFromWatchlist);

// @route   PUT api/users/profile
// @desc    Update user profile
router.put('/profile', upload.single('avatar'), updateProfile);

// @route   POST api/users/history
// @desc    Add movie to history
router.post('/history', addToHistory);

// @route   DELETE api/users/history/:movieId
// @desc    Remove movie from history
router.delete('/history/:movieId', removeFromHistory);

// @route   GET api/users/recommendations
// @desc    Get movie recommendations based on watchlist
router.get('/recommendations', getRecommendations);

// Add the cacheMiddleware before the controller function
// router.get('/recommendations', cacheMiddleware, getRecommendations);


export default router;