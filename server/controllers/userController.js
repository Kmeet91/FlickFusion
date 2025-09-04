import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // Needed if you add password change later
import axios from 'axios';
import myCache from '../cache.js';
// Get current user's data (including watchlist)
export const getCurrentUser = async (req, res) => {
    try {
        // req.user.id is available from the authMiddleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a movie to the watchlist
export const addToWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const movie = req.body; // The movie object from the frontend

        // Check if movie is already in watchlist
        if (user.watchlist.some(item => item.id === movie.id)) {
            return res.status(400).json({ msg: 'Movie already in watchlist' });
        }

        user.watchlist.unshift(movie);
        await user.save();
        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Remove a movie from the watchlist
export const removeFromWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const movieId = req.params.movieId;

        // Filter out the movie to remove
        user.watchlist = user.watchlist.filter(
            ({ id }) => id.toString() !== movieId
        );

        await user.save();
        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a movie to the watch history
export const addToHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const movie = req.body; // The movie object from the frontend

        // Optional: Prevent exact duplicates in history
        if (user.history.some(item => item.id === movie.id)) {
            // You could move the item to the top or just do nothing
            // For now, we'll just prevent adding it again.
            return res.json(user.history);
        }

        user.history.unshift(movie); // Add the movie to the beginning of the history
        await user.save();
        res.json(user.history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Remove a movie from the watch history
export const removeFromHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const movieId = req.params.movieId;

        // Filter out the movie to remove from history
        user.history = user.history.filter(
            (item) => item.id.toString() !== movieId
        );

        await user.save();
        res.json(user.history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        // If a file was uploaded, save its filename
        if (req.file) {
            user.avatar = req.file.filename; // <-- The only change is here
        }

        const updatedUser = await user.save();
        // Return a lean object without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json(userResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get recommendations based on user's watch history
export const getRecommendations = async (req, res) => {
    const cacheKey = req.originalUrl;

    try {
        const user = await User.findById(req.user.id);
        if (!user || user.history.length === 0) {
            return res.json([]);
        }

        const lastWatched = user.history[0];
        if (!lastWatched || !lastWatched.id) {
            return res.json([]);
        }

        const mediaType = lastWatched.media_type || 'movie';
        const apiKey = process.env.TMDB_API_KEY;

        if (!apiKey) {
            console.error("TMDB_API_KEY is not defined in the .env file. - userController.js:147");
            return res.status(500).send('Server configuration error.');
        }

        // Add a specific try/catch for the external API call
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${lastWatched.id}/recommendations?api_key=${apiKey}`);
            const recommendations = response.data.results;

            // --- SAVE TO CACHE ---
            // Save the data to the cache. The default 1-hour expiration will be used.
            // myCache.set(cacheKey, JSON.stringify(recommendations));

            res.json(recommendations);
        } catch (apiError) {
            // If the TMDb API fails, log it on the server...
            console.error("TMDb API error in getRecommendations: - userController.js:163", apiError.message);
            // ...but send a successful empty response to the frontend.
            res.json([]);
        }

    } catch (dbError) {
        // This will catch errors related to finding the user in our DB
        console.error("Database error in getRecommendations: - userController.js:170", dbError.message);
        res.status(500).send('Server Error');
    }
};
// ... You would add functions for updating profile here later