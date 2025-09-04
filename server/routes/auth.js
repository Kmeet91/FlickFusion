import express from 'express';
import { register, login, checkUsername, checkEmail } from '../controllers/authController.js'; // <-- Note the .js extension

const router = express.Router();

// @route   POST api/auth/register
router.post('/register', register);

// @route   POST api/auth/login
router.post('/login', login);

// @route   POST api/auth/check-username
router.post('/check-username', checkUsername);

// @route   POST api/auth/check-email
router.post('/check-email', checkEmail);

// Use 'export default' for the router
export default router;