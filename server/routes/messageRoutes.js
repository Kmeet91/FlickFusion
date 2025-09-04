import express from 'express';
import { createMessage } from '../controllers/messageController.js';

const router = express.Router();

// @route   POST api/messages
// @desc    Create a new contact message
router.post('/', createMessage);

export default router;