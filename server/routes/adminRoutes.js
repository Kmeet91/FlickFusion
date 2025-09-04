import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
    getAllUsers, deleteUser,
    getAllMessages, deleteMessage,
    getAllReviews, deleteReview,
    updateUser
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware, adminMiddleware);

// User routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

// Message routes
router.get('/messages', getAllMessages);
router.delete('/messages/:id', deleteMessage);

// Review routes
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;