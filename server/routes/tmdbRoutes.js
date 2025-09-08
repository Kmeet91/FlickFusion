import express from 'express';
import { getTrending, getNetflixOriginals, getTopRated, getWatchProviders } from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/trending', getTrending);
router.get('/netflix-originals', getNetflixOriginals);
router.get('/top-rated', getTopRated);
router.get('/providers/:mediaType/:id', getWatchProviders);

export default router;