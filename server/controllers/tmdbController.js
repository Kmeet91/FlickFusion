import axios from 'axios';
import myCache from '../cache.js';

const apiKey = process.env.TMDB_API_KEY;

// This new generic function contains our "stale-while-revalidate" logic
const fetchWithCacheFallback = async (res, cacheKey, tmdbUrl) => {
    try {
        // --- Step 1: Always try to fetch fresh data first ---
        console.log(`FETCHING fresh data for: ${cacheKey} - tmdbController.js:10`);
        const response = await axios.get(tmdbUrl);
        const freshData = response.data;

        // --- Step 2: If successful, update the cache and send the fresh data ---
        myCache.set(cacheKey, JSON.stringify(freshData));
        console.log(`SUCCESS: Saved fresh data to cache for ${cacheKey} - tmdbController.js:16`);
        res.json(freshData);

    } catch (error) {
        // --- Step 3: If the API call fails, try to use the cache as a fallback ---
        console.warn(`API_FETCH_FAILED for ${cacheKey}. Attempting to use cache. - tmdbController.js:21`);

        const staleData = myCache.get(cacheKey);
        if (staleData) {
            // If we have old data in the cache, send that
            console.log(`FALLBACK: Served stale data from cache for ${cacheKey} - tmdbController.js:26`);
            res.json(JSON.parse(staleData));
        } else {
            // If there's no cached data either, we must send an error
            console.error(`CRITICAL: API fetch failed and no cache was available for ${cacheKey} - tmdbController.js:30`);
            // res.status(502).json({ msg: "Service is temporarily unavailable. Please try again later." }); // 502 Bad Gateway
        }
    }
};

export const getTrending = (req, res) => {
    const tmdbUrl = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    fetchWithCacheFallback(res, req.originalUrl, tmdbUrl);
};

export const getNetflixOriginals = (req, res) => {
    const tmdbUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_networks=213`;
    fetchWithCacheFallback(res, req.originalUrl, tmdbUrl);
};

export const getTopRated = (req, res) => {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US`;
    fetchWithCacheFallback(res, req.originalUrl, tmdbUrl);
};

export const getWatchProviders = (req, res) => {
    const { mediaType, id } = req.params;
    const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers?api_key=${apiKey}`;
    fetchWithCacheFallback(res, req.originalUrl, tmdbUrl);
};