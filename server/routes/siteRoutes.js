import express from 'express';
import { getDeveloperInfo } from '../controllers/siteController.js';

const router = express.Router();

// @route   GET api/site/developer-info
// @desc    Get public info for the site developer
router.get('/developer-info', getDeveloperInfo);

export default router;