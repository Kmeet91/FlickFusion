import express from 'express';
import { getTrending, getNetflixOriginals, getTopRated } from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/trending', getTrending);
router.get('/netflix-originals', getNetflixOriginals);
router.get('/top-rated', getTopRated);

export default router;